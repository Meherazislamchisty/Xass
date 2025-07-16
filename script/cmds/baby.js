const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.jan;
};

async function getBotResponse(message) {
  try {
    const base = await baseApiUrl();
    const response = await axios.get(`${base}/jan/font3/${encodeURIComponent(message)}`);
    return response.data?.message || "try Again";
  } catch (error) {
    console.error("API Error:", error.message || error);
    return "error janu 🥲";
  }
}

module.exports = {
  config: {
    name: "bot2",
    version: "1.7",
    author: "MahMUD",
    role: 0,
    description: { en: "no prefix command." },
    category: "ai",
    guide: { en: "just type jan" },
  },

  onStart: async function () {},

  onReply: async function ({ api, event }) {
    if (event.type === "message_reply") {
      let message = event.body.toLowerCase() || "opp2";
      if (message) {
        const replyMessage = await getBotResponse(message);
        api.sendMessage(replyMessage, event.threadID, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "bot2",
              type: "reply",
              messageID: info.messageID,
              author: event.senderID,
              text: replyMessage,
            });
          }
        }, event.messageID);
      }
    }
  },

  onChat: async function ({ api, event }) {
    const responses = [
        "আমরা দারুণ রকমের দুঃখ সাজাই প্রবল ভালোবেসে..!😅💔",
        "- আমি যখন একটু খুশি হওয়ার চেষ্টা করি, তখন দুঃখ এসে আবার আমাকে আঁকড়ে ধরে 😅💔",
        " °°অনুভূতি প্রকাশ করতে নেই মানুষ নাটক মনে করে মজা নেয়°..! 😥💔🥀",
        " কিছু মানুষ স্বল্প সময়ের জন্য আমাদের জীবনে আসে।কিন্তু দীর্ঘ সময় স্মৃতি রেখে যায়..!🙂💔",
        "𝙴𝙸 𝙿𝙰𝙶𝙾𝙻 𝙴𝚃𝙾 𝙳𝙰𝙺𝙾𝚂 𝙺𝙴𝙽?",
        " 𝙼𝚈𝙱 𝙸 𝙹𝚄𝚂𝚃 𝚆𝙰𝙽𝙽𝙰 𝙱𝙴 𝚈𝙾𝚄𝚁𝚂 ? 😌💝",
        " 𝙸 𝚂𝙰𝚈 𝙸 𝙻𝙾𝚅𝙴 𝚈𝙾𝚄 𝙵𝙾𝚁𝙴𝚅𝙴𝚁💝🐼",
        "য়ামরা কি ভন্দু হতে পারিহ?? নাহ্লে তার থেকে বেসি কিচু??😋",
        " 𝚈𝚄𝙼𝙼𝚈 𝙱𝙱𝚈 𝚈𝙾𝚄 𝙰𝚁𝙴 𝚂𝙾 𝚂𝚆𝙴𝙴𝚃😋🤤",
        "𝙰𝚌𝙲𝙲𝙰𝙷 𝙱𝙾𝙻𝙾 𝙰𝙼𝙺𝙴 𝙻𝙰𝙶𝙱𝙴 𝙽𝙰𝙺𝙸 𝚁𝚄𝚂𝚂𝙸𝙰𝙽 ?",
        "তোর সাথে কথা নাই কারণ তুই অনেক লুচ্চা",
        " এইখানে লুচ্চামি করলে লাথি দিবো কিন্তু",
        "আমাকে চুমু দিবি 🫢🦋",
        "হেহে বাবু আমার কাছে আসো 😘💋",
        "আমি তোমাকে অনেক ভালোবাসি বাবু🥺💖",
        "your chocolate বট এর help list dekhte type koron *help",
        "কিরে বলদ তুই এইখানে 🙂",
        " আমাকেq চিনো না জানু? মনু",
        "hey bbe I'm your personal Based chatbot you ask me anything",
        "AR asbo na tor kache",
        "আমাকে ডাকলে ,আমি কিন্তু 𝐊𝐢𝐬𝐬 করে দিবো 😘",
        "Hop beda dakos kn🥲",
        "-তাবিজ কইরা হইলেও ফ্রেম এক্কান করমুই তাতে যা হই হোক-🤧🥱",
        " ওই মামী আর ডাকিস না প্লিজ🥲",
        " হ্যা বলো, শুনছি আমি",
        "বলো কি করতে পারি তোমার জন্য😌 ",
        "𝐁𝐨𝐭 না জানু,বলো কারন আমি সিংগেল 😌 ",
        " I love you tuna🥺🥶",
        "Tuma dew xanu😍😘 ",
        " এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈",
        " দেখা হলে কাঠগোলাপ দিও..🤗",
        "𝗕𝗲𝘀𝗵𝗶 𝗱𝗮𝗸𝗹𝗲 𝗮𝗺𝗺𝘂 𝗯𝗼𝗸𝗮 𝗱𝗲𝗯𝗮 𝘁𝗼__🥺 ",
        "•-কিরে🫵 তরা নাকি  prem করস..😐🐸•আমারে একটা করাই দিলে কি হয়-🥺 ",
        "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈💋 ",
        "Single taka ki oporad🥺 ",
        " Premer mora jole duve na😛",
        "Ufff matha gorom kore disos😒 ",
        "Boss ayan er chipay😜 ",
        "bashi dakle boss meheraz ke bole dimu😒 ",
        "Xhipay atke gaci jan🥲 ",
        "Washroom a🤣 ",
        "bado maser kawwa police amar sawwa😞 ",
        "I am single plz distrab me🥺🥲 ",
        "𝗮𝗺𝗶 𝗯𝗼𝘁 𝗻𝗮 𝗮𝗺𝗮𝗸𝗲 𝗯𝗯𝘆 𝗯𝗼𝗹𝗼 𝗯𝗯𝘆!!😘 ",
        "🍺 এই নাও জুস খাও..!𝗕𝗯𝘆 বলতে বলতে হাপায় গেছো না 🥲 ",
        "𝗛𝗶𝗶 𝗶 𝗮𝗺 𝗯𝗼𝘁 𝗰𝗮𝗻 𝗶 𝗵𝗲𝗹𝗽 𝘆𝗼𝘂!🤖 ",
        "𝗲𝘁𝗼 𝗯𝗼𝘁 𝗯𝗼𝘁 𝗻𝗮 𝗸𝗼𝗿𝗲 𝘁𝗮𝗸𝗮 𝗼 𝘁𝗼 𝗽𝗮𝘁𝗵𝗮𝘁𝗲 𝗽𝗮𝗿𝗼😒🥳🥳 ",
        "𝘁𝗼𝗿𝗲 𝗺𝗮𝗿𝗮𝗿 𝗽𝗿𝗲𝗽𝗲𝗿𝗮𝘁𝗶𝗼𝗻 𝗻𝗶𝗰𝗵𝗶...!!.🫡 ",
        "𝘂𝗺𝗺𝗮𝗵 𝗱𝗶𝗹𝗲 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂 𝗸𝗼𝗺𝘂 𝗸𝗶𝗻𝘁𝘂😑 ",
        " আমাকে ডাকলে ,আমি কিন্তু 𝐊𝐢𝐬𝐬 করে দিবো 😘",
        " Bal falaw😩",
        "Tapraiya dat falai demu🥴 ",
        "He🤤bolo amar jan kmn aso🤭 ",
        "Hmmm jan ummmmmmah🫣 ",
        "Chup kor ato bot bot koros kn😬 ",
        "Yes sir/mem😍 ",
        "Assalamualikum☺️💖 ",
        "Walaikumsalam😫🤓 ",
        "Chaiya takos kn ki kobi kooo☹️ ",
        "Onek boro beyadop re tui😒 ",
        "Amar shate kew sex opps tex kore na😫 ",
        "অনুমতি দিলাম-𝙋𝙧𝙤𝙥𝙤𝙨𝙚 কর বস কে-🐸😾🔪 ",
        "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏 ",
        "-আজ একটা বিন নেই বলে ফেসবুকের নাগিন-🤧-গুলোরে আমার বস Ayan ধরতে পারছে না-🐸🥲 ",
        " তোর কি চোখে পড়ে না আমি ব্যাস্ত 😒🐱",
        "বলো কি বলবা, চিপায় যাইয়া বলবা নাকি সবার সামনে বলবা ?🤭",
    ];

    const mahmuds = ["jan", "bby", "baby", "nezuko", "bot", "Nezuko", " bby", "Baby", " Bby"];
    let message = event.body ? event.body.toLowerCase() : "";
    const words = message.split(" ");
    const wordCount = words.length;

    if (event.type !== "message_reply" && mahmuds.some(mahmud => message.startsWith(mahmud))) {
      api.setMessageReaction("🪽", event.messageID, () => {}, true);
      api.sendTypingIndicator(event.threadID, true);

      if (wordCount === 1) {
        const randomMsg = responses[Math.floor(Math.random() * responses.length)];
        api.sendMessage({ body: randomMsg }, event.threadID, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "bot2",
              type: "reply",
              messageID: info.messageID,
              author: event.senderID,
              link: randomMsg,
            });
          }
        }, event.messageID);
      } else {
        words.shift();
        const userText = words.join(" ");
        const botResponse = await getBotResponse(userText);
        api.sendMessage(botResponse, event.threadID, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "bot2",
              type: "reply",
              messageID: info.messageID,
              author: event.senderID,
              text: botResponse,
            });
          }
        }, event.messageID);
      }
    }
  },
};
