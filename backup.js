const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const login = require("xass-fca");
const fs = require("fs");
const autoReact = require("./handle/autoReact");
const unsendReact = require("./handle/unsendReact");
const chalk = require("chalk");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const configPath = path.join(__dirname, "config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

app.use(bodyParser.json());
app.use(express.static("public"));

global.XassBoT = {
  commands: new Map(),
  events: new Map(),
  onlineUsers: new Map(),
};

global.XassBot = {
  BaYjid: "https://xass-api.vercel.app/"
};

let isLoggedIn = false;
let loginAttempts = 0;
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000;

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Edg/120.0.2210.77",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:114.0) Gecko/20100101 Firefox/114.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:114.0) Gecko/20100101 Firefox/114.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.51",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 11; SM-A127F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
];

const getRandomUserAgent = () => {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
};

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
        chalk.bold.gray("[") + 
        chalk.bold.cyan("INFO") + 
        chalk.bold.gray("] ") + 
        chalk.bold.green(`Loaded ${type.slice(0, -1)}: `) + 
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

    const loginOptions = {
      appState: appState,
      userAgent: getRandomUserAgent(),
    };

    login(loginOptions, (err, api) => {
      if (err) {
        console.error(
          chalk.bold.gray("[") + 
          chalk.bold.red("ERROR") + 
          chalk.bold.gray("] ") + 
          chalk.bold.redBright("Failed to auto-login:")
        );
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
    console.error(
      chalk.bold.gray("[") +
      chalk.bold.red("ERROR") +
      chalk.bold.gray("] ") +
      chalk.bold.redBright("appstate.json not found. Please login manually first.")
    );
  }
};

const retryLogin = () => {
  if (loginAttempts >= MAX_RETRIES) {
    console.error(
      chalk.bold.gray("[") + 
      chalk.bold.red("ERROR") + 
      chalk.bold.gray("] ") + 
      chalk.bold.redBright("Max login attempts reached. Please check your appstate file.")
    );
    return;
  }

  loginAttempts++;
  console.log(
    chalk.bold.gray("[") + 
    chalk.bold.yellow("RETRY") + 
    chalk.bold.gray("] ") + 
    chalk.bold.yellowBright(`Retrying login attempt ${loginAttempts} of ${MAX_RETRIES}...`)
  );

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
      console.error(
        chalk.bold.gray("[") + 
        chalk.bold.red("ERROR") + 
        chalk.bold.gray("] ") + 
        chalk.bold.redBright("Connection error detected, attempting relogin...")
      );
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
      chalk.bold.gray("[") + 
      chalk.bold.cyan("INFO") + 
      chalk.bold.gray("] ") + 
      chalk.bold.green("Keep-alive signal sent")
    ));
  }, 1000 * 60 * 15);
};

const handleEvent = async (api, event, prefix) => {
  const { events } = global.XassBoT;
  try {
    for (const { onEvent } of events.values()) {
      await onEvent({ prefix, api, event });
    }
  } catch (err) {
    console.error(
      chalk.bold.gray("[") + 
      chalk.bold.red("ERROR") + 
      chalk.bold.gray("] ") + 
      chalk.bold.redBright("Event handler error:")
    );
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
    console.log(chalk.bold.yellow(`[XASS INFO] Found Facebook link: ${facebookURL}`));

    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/fbdl?url=${encodeURIComponent(facebookURL)}`;
      const response = await axios.get(apiUrl);
      const videoData = response.data;

      if (videoData && videoData.videoUrl) {
        console.log(chalk.bold.green("[XASS INFO] Video URL found, starting download..."));

        const videoPath = path.join(__dirname, "fb_video.mp4");
        const writer = fs.createWriteStream(videoPath);

        const videoStream = await axios.get(videoData.videoUrl, { responseType: 'stream' });
        videoStream.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        console.log(chalk.green("[XASS INFO] Video downloaded successfully. Sending..."));
        api.sendMessage({
          body: `${videoData.title}`,
          attachment: fs.createReadStream(videoPath)
        }, event.threadID, () => fs.unlinkSync(videoPath), event.messageID);

        console.log(chalk.green("[XASS INFO] Video sent successfully."));
      } else {
        console.log(chalk.bold.yellow("[XASS WARNING] No video URL found in the API response."));
        api.sendMessage("Sorry, I couldn't retrieve the video from that link.", event.threadID);
      }

    } catch (error) {
      console.error(chalk.bold.red(`[XASS ERROR] Error during video download: ${error}`));
      api.sendMessage("Sorry, I encountered an error while trying to download the video.", event.threadID);
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

init().then(() => app.listen(PORT, () => console.log(
  chalk.bold.gray("[") + 
  chalk.bold.green("SERVER") + 
  chalk.bold.gray("] ") + 
  chalk.bold.greenBright(`Running on http://localhost:${PORT}`)
)));