const fs = require("fs");
const path = require("path");

process.on("unhandledRejection", () => {});
process.on("uncaughtException", () => {});

module.exports = {
    name: "joinNoti",
    version: "1.0.0",
    description: "Join notifications",
    author: "BaYjid",
    async onEvent({ api, event }) {
        try {
            const { logMessageType, logMessageData, threadID, author } = event;
            const currentUserID = await api.getCurrentUserID();
            const threadInfo = await api.getThreadInfo(threadID).catch(() => null);

            if (!threadInfo || !Array.isArray(threadInfo.participantIDs)) return;
            if (!threadInfo.participantIDs.includes(currentUserID)) return;

            if (logMessageType === "log:subscribe") {
                const { addedParticipants } = logMessageData;

                const newParticipants = addedParticipants.filter(participant => participant.userFbId !== currentUserID);

                if (newParticipants.length === 0) {
                  
                    const aiIntro = `👨‍🏫 Greetings, everyone! I'm RTUMM AI, your friendly educational assistant designed by Math Major.

I'm excited to be here and ready to support you on your learning journey. Whether you need help with math or have questions about other subjects, just ask.

Type ‘/help’ to see the available commands, and let's make learning fun and interactive together.`;

                    const selfGreetGifPath = path.join(__dirname, "assets", "giphy.gif");
                    if (!fs.existsSync(selfGreetGifPath)) {
                      console.error("GIF file not found!");
                      api.sendMessage(aiIntro, threadID);
                      return;
                    }
                    
                    api.sendMessage({
                        body: aiIntro,
                        attachment: fs.createReadStream(selfGreetGifPath)
                    }, threadID).catch(err => console.error(err));

                    return;
                }

                const participantsList = newParticipants.map(i => i.fullName).join(", ");

                const aiIntro = `👨‍🏫 Greetings, everyone! I'm RTUMM AI, your friendly educational assistant designed by Math Major.
                
I'm excited to be here and ready to support you on your learning journey. Whether you need help with math or have questions about other subjects, just ask.

Type ‘/help’ to see the available commands, and let's make learning fun and interactive together.`;

                const userWelcome = `Welcome ${participantsList}! burat.`;

                const welcomeMessage = `${aiIntro}\n\n${userWelcome}`;

                const newMemberGifPath = path.join(__dirname, "assets", "hi.gif");
                if (!fs.existsSync(newMemberGifPath)) {
                  console.error("GIF file not found!");
                  api.sendMessage(welcomeMessage, threadID);
                  return;
                }

                api.sendMessage({
                    body: welcomeMessage,
                    attachment: fs.createReadStream(newMemberGifPath)
                }, threadID).catch(err => console.error(err));
            }

            if (logMessageType === "log:thread-name") {
              const newThreadName = logMessageData.name;
              api.sendMessage(`Group name has been changed to: ${newThreadName}`, threadID);
            }

             if (logMessageType === "log:thread-icon") {
               api.sendMessage("The group icon has been updated", threadID);
             }

        } catch (err) {
            console.error(err);
        }
    },
};