const axios = require("axios");

module.exports = {
    name: "ai",
    description: "Interact with ChatGPT-4",
    xassPrefix: false,
    version: "1.0.0",
    cooldowns: 5,
    aliases: ["gpt4"],
    usage: "[prompt]",
    example: "ai what is the capital of France?",
    category: "AI",
    execute: async (api, event, args, prefix) => {
        const { threadID, messageID } = event;
        let prompt = args.join(" ");

        if (!prompt) {
            return api.sendMessage({
                body: "Please enter a prompt. Example: `" + prefix + (module.exports.name || "") + " " + (module.exports.example ? module.exports.example.split(" ").slice(1).join(" ") : "") + "`"
            }, threadID, messageID);
        }

        try {
            const info = await api.sendMessage({body: "[ ChatGPT-4 ]\n\nPlease wait..."}, threadID, messageID);

            const response = await axios.get(`https://zen-api.up.railway.app/api/chatgpt4?prompt=${encodeURIComponent(prompt)}`);
            const reply = response.data.response;

            api.editMessage(reply, info.messageID);

        } catch (error) {
            console.error("Error fetching data:", error.message);
            api.sendMessage({body: "Failed to fetch data. Please try again later.\n\nError: " + error.message}, threadID, messageID);
        }
    },
};