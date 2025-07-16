require("dotenv").config(); // .env file load
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const login = require("xass-fca");
const fs = require("fs");
const autoReact = require("./handle/autoReact");
const unsendReact = require("./handle/unsendReact");
const chalk = require("chalk");
const axios = require("axios");
const mongoose = require("mongoose"); // MongoDB

const app = express();
const PORT = process.env.PORT || 3000;
const configPath = path.join(__dirname, "config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

app.use(bodyParser.json());
app.use(express.static("public"));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected!"))
.catch((err) => console.error("❌ MongoDB Error:", err));

// Global Objects
global.XassBoT = {
  commands: new Map(),
  events: new Map(),
  onlineUsers: new Map(),
};

global.XassBot = {
  BaYjid: "https://xass-api-vrx5.onrender.com/"
};

let isLoggedIn = false;
let loginAttempts = 0;
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000;

const userAgents = [ /* user agents list same as before */ ];
const getRandomUserAgent = () => userAgents[Math.floor(Math.random() * userAgents.length)];

const loadModules = (type) => {
  const folderPath = path.join(__dirname, type);
  const files = fs.readdirSync(folderPath).filter(file => file.endsWith(".js"));

  console.log(chalk.bold.redBright(`──LOADING ${type.toUpperCase()}──●`));
  files.forEach(file => {
    const module = require(path.join(folderPath, file));
    if (module && module.name && module[type === "commands" ? "execute" : "onEvent"]) {
      module.xassPrefix = module.xassPrefix !== undefined ? module.xassPrefix : true;
      global.XassBoT[type].set(module.name, module);
      console.log(
        chalk.bold.gray("[") + chalk.bold.cyan("INFO") +
        chalk.bold.gray("] ") + chalk.bold.green(`Loaded ${type.slice(0, -1)}: `) +
        chalk.bold.magenta(module.name)
      );
    }
  });
};

const AutoLogin = async () => {
  if (isLoggedIn) return;
  const appStatePath = path.join(__dirname, "appstate.json");

  if (fs.existsSync(appStatePath)) {
    const appState = JSON.parse(fs.readFileSync(appStatePath, "utf8"));
    const loginOptions = { appState, userAgent: getRandomUserAgent() };

    login(loginOptions, (err, api) => {
      if (err) {
        console.error(chalk.red("❌ Login failed. Retrying..."));
        retryLogin();
        return;
      }
      const cuid = api.getCurrentUserID();
      global.XassBoT.onlineUsers.set(cuid, { userID: cuid, prefix: config.prefix });
      setupBot(api, config.prefix);
      isLoggedIn = true;
      loginAttempts = 0;
    });
  } else {
    console.error(chalk.red("❌ appstate.json not found."));
  }
};

const retryLogin = () => {
  if (loginAttempts >= MAX_RETRIES) {
    console.error(chalk.red("❌ Max login attempts reached."));
    return;
  }
  loginAttempts++;
  console.log(chalk.yellow(`🔁 Retrying login attempt ${loginAttempts}/${MAX_RETRIES}`));
  setTimeout(AutoLogin, RETRY_INTERVAL);
};

const setupBot = (api, prefix) => {
  api.setOptions({
    forceLogin: false,
    selfListen: true,
    autoReconnect: true,
    listenEvents: true,
    userAgent: getRandomUserAgent(),
  });

  api.listenMqtt(async (err, event) => {
    if (err) {
      console.error(chalk.red("❌ Connection error. Reattempting login..."));
      isLoggedIn = false;
      retryLogin();
      return;
    }

    await handleFacebookLink(api, event);
    handleMessage(api, event, prefix);
    handleEvent(api, event, prefix);
    autoReact(api, event);
    unsendReact(api, event);
  });

  setInterval(() => {
    api.getFriendsList(() => console.log(
      chalk.cyan("[INFO] Keep-alive signal sent")
    ));
  }, 1000 * 60 * 15);
};

const handleEvent = async (api, event, prefix) => {
  try {
    for (const { onEvent } of global.XassBoT.events.values()) {
      await onEvent({ prefix, api, event });
    }
  } catch (err) {
    console.error(chalk.red("❌ Event handler error:"), err);
  }
};

const handleMessage = async (api, event, prefix) => {
  if (!event.body) return;
  let [command, ...args] = event.body.trim().split(" ");
  if (command.startsWith(prefix)) command = command.slice(prefix.length);

  const cmdFile = global.XassBoT.commands.get(command.toLowerCase());
  if (cmdFile) {
    const xassPrefix = cmdFile.xassPrefix !== false;
    if (xassPrefix && !event.body.toLowerCase().startsWith(prefix)) return;

    const userId = event.senderID;
    if (cmdFile.role === "admin" && userId !== config.adminUID) {
      return api.sendMessage("You don't have permission to use this command.", event.threadID);
    }

    try {
      await cmdFile.execute(api, event, args, prefix);
    } catch (err) {
      api.sendMessage(`Command error: ${err.message}`, event.threadID);
    }
  }
};

const handleFacebookLink = async (api, event) => {
  const facebookLinkRegex = /(https?:\/\/(www\.)?(facebook\.com|fb\.watch)\/.*)/i;
  const match = event.body.match(facebookLinkRegex);

  if (match) {
    const facebookURL = match[0];
    console.log(chalk.yellow(`[XASS INFO] Facebook link: ${facebookURL}`));

    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/fbdl?url=${encodeURIComponent(facebookURL)}`;
      const response = await axios.get(apiUrl);
      const videoData = response.data;

      if (videoData && videoData.videoUrl) {
        const videoPath = path.join(__dirname, "fb_video.mp4");
        const writer = fs.createWriteStream(videoPath);

        const videoStream = await axios.get(videoData.videoUrl, { responseType: 'stream' });
        videoStream.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        api.sendMessage({
          body: `${videoData.title}`,
          attachment: fs.createReadStream(videoPath)
        }, event.threadID, () => fs.unlinkSync(videoPath), event.messageID);

      } else {
        api.sendMessage("Couldn't retrieve the video from that link.", event.threadID);
      }

    } catch (error) {
      console.error(chalk.red(`[XASS ERROR] Video download error: ${error}`));
      api.sendMessage("Error occurred while downloading the video.", event.threadID);
    }
  }
};

const init = async () => {
  await loadModules("commands");
  await loadModules("events");
  await AutoLogin();

  console.log(chalk.bold.blueBright("──XASS BOT──"));
  console.log(chalk.bold.red(`
 █▄░█ ▀█▀ █▀█ █▀█
 █░▀█ ░█░ █▄█ █▄█`));
  console.log(chalk.bold.yellow("Credits: XASS Bot by BaYjid"));
};

init().then(() =>
  app.listen(PORT, () =>
    console.log(chalk.greenBright(`✅ Server Running: http://localhost:${PORT}`))
  )
);