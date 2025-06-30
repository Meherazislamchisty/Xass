const axios = require("axios");

module.exports = {
    name: "deepseek",
    description: "Interact with Deepseek AI",
    xassPrefix: false,
    version: "1.0.0",
    cooldowns: 5,
    aliases: [],
    usage: "[query]",
    example: "deepseek what is the speed of light?",
    category: "AI",
    execute: async (api, event, args, prefix) => {
        const { threadID, messageID } = event;
        let query = args.join(" ");

        if (!query) {
            api.sendMessage({
                body: "Please enter a query. Example: `" + prefix + (module.exports.name || "") + " " + (module.exports.example ? module.exports.example.split(" ").slice(1).join(" ") : "") + "`"
            }, threadID, messageID);
            return;
        }

        try {
            const info = await api.sendMessage({body: "[ Deepseek AI ]\n\nPlease wait..."}, threadID, messageID);
            const response = await axios.get(`https://zen-api.up.railway.app/api/deepseek?query=${encodeURIComponent(query)}`);
            let reply = response.data.response;
            reply = reply.replace(/\n\n\n/g, "");
            reply = reply.replace(/<think>/g, "");
            reply = reply.replace(/<\/think>/g, "");
            api.editMessage(reply, info.messageID);
        } catch (error) {
            api.sendMessage({body: "Failed to fetch data. Please try again later.\n\nError: " + error.message}, threadID, messageID);
        }
    },
};