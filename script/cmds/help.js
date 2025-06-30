module.exports = {
    name: "help",
    description: "Displays a list of available commands and their descriptions.",
    xassPrefix: false,
    version: "1.0.2",
    role: 0,
    cooldowns: 7,
    aliases: ["help"],
    execute(api, event, args, prefix) {
        const commands = global.NashBoT.commands;
        const events = global.NashBoT.events;
        const { threadID, messageID } = event;

        const itemsPerPage = 10; // Reduced for readability
        let pageNumber = args[0] ? parseInt(args[0], 10) : 1;
        pageNumber = isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber;

        let commandList = "╭━━━━━༺༻━━━━━╮\n";
        commandList += `          𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝑮𝒖𝒊𝒅𝒆\n`;
        commandList += `                 𝑷𝒂𝒈𝒆 ${pageNumber}\n`;
        commandList += "╰━━━━━༺༻━━━━━╯\n\n";

        const allCommands = [];
        const eventEntries = Array.from(events.keys());

        commands.forEach((cmd, name) => {
            allCommands.push({ name: name, description: cmd.description || "No description available." }); // Include description
        });

        const allEntries = [...allCommands, ...eventEntries];
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        let paginatedEntries = allEntries.slice(startIndex, endIndex);

        let hasListedCommands = false;
        let hasListedEvents = false;

        paginatedEntries.forEach(entry => {
            if (typeof entry === 'object' && entry.name) {
                if (!hasListedCommands) {
                    commandList += "𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔:\n";
                    hasListedCommands = true;
                }
                commandList += `   ↳ ${entry.name} - ${entry.description}\n`;
            } else if (eventEntries.includes(entry)) {
                if (!hasListedEvents && hasListedCommands) {
                    commandList += "\n𝑬𝒗𝒆𝒏𝒕𝒔:\n";
                    hasListedEvents = true;
                }
                commandList += `   ↳ ${entry}\n`; // Basic event listing
            }
        });

        if (paginatedEntries.length < itemsPerPage && pageNumber > 1) {
            commandList += "\n  No more commands/events.";
        }

        commandList += `\n  Send 'help 1', 'help 2', etc., to see more commands.\n`;
        commandList += "╭━━━━━━━━━━━━━━━━━╯\n";

        api.sendMessage(commandList, threadID, messageID);
    },
};
