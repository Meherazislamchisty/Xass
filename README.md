# 🎀BOTcut

<div align="center">
  <img src="https://files.catbox.moe/7tfxcz.jpg" alt="Profile Image" width="120" height="120" style="border-radius: 50%;">
  <p><strong>🎀BOTcut</strong></p>
  <h2><strong>🤖 🎀BOTcut BOT</strong></h2>
  <p>Welcome to <strong>XASS BOT</strong> – your ultimate AI-powered companion for managing Facebook group chats effortlessly and smartly!</p>
</div>

---

## 🛠️ How to Create a Command

```javascript
module.exports = {
  name: "greet",
  description: "Greets the user – example command",
  xassPrefix: true, // Requires XASS Bot prefix to trigger
  role: "admin", // Can be 'admin' or 'user'
  execute: (api, event, args, prefix) => {
    api.sendMessage(`👋 Hello there! Thanks for using XASS Bot.`, event.threadID);
  },
};
```

---

## ✨ Features

- 🎯 **Command Handling**
  - Dynamic module-based command loading
  - Prefix-based command recognition
  - Role-based access (admin/user)

- 🔐 **Automatic Login**
  - Uses Facebook `appstate.json` securely
  - Session recovery and reconnect support

- ⚡ **Real-time Event Listening**
  - Supports `typing`, `message`, `unsend`, `react` events
  - Easy to expand with custom event handlers

- ⚙️ **Configuration Friendly**
  - Fully customizable via `config.json`
  - Admin UIDs, prefixes, and toggles easily editable

- 🎨 **Custom Styling Output**
  - Supports styled messages with ASCII banners
  - Emoji-based menus, paginated help sections

- 🧩 **Extendable Modules**
  - Drop your command in `/modules/commands/` – auto-loads
  - Create event handlers in `/handle/` – plug-and-play

---

## 🧩 Troubleshooting Guide

| Issue                      | Solution                                                                 |
|---------------------------|--------------------------------------------------------------------------|
| ❌ Bot fails to login      | Check `appstate.json` validity and Facebook session                      |
| 🔇 Commands not responding | Make sure prefix matches and command file is loaded                      |
| 🚫 Access Denied           | Check your UID in `adminUID` or your command role permissions            |
| 🛑 Bot crashes randomly    | Add error handling, check memory usage and logs                          |

---

## 🧠 Helpful Developer Notes

- 🗂️ **Folder Structure Suggestion**
  ```
  /xass-bot
  ├── appstate.json
  ├── config.json
  ├── index.js
  ├── package.json
  ├── handle/
  │   ├── autoReact.js
  │   └── unsendReact.js
  ├── modules/
  │   └── commands/
  │       └── greet.js
  └── utils/
  ```

- 💡 **Environment Variables (optional)**
  Add support for `.env` to manage:
  ```env
  ADMIN_UID=100xxxxxxxxxxx
  PREFIX=/
  VERSION=2.4.0
  ```

- 🧪 **Debugging Tip**
  Add `console.log()` in `listenMqtt()` to check message structure:
  ```js
  api.listenMqtt((err, message) => {
    if (err) return console.error(err);
    console.log(JSON.stringify(message, null, 2));
  });
  ```

---

# 📘 Facebook AppState (C3C Method)

## 📖 Overview
Use Facebook `appstate.json` for seamless login without email/password. C3C makes it easy.

---

## 📱 Requirements

- ✅ **Kiwi Browser** (from Play Store)
- ✅ **C3C Extension** ([Download Here](https://github.com/c3cbot/c3c-ufc-utility/releases/tag/2.0.1))

---

## 🧪 Step-by-Step: Get AppState Using C3C

### 🔽 Step 1: Download C3C Extension
- Go to the [C3C GitHub](https://github.com/c3cbot/c3c-ufc-utility/releases/tag/2.0.1)
- Download and extract the ZIP file

### 🧠 Step 2: Install in Kiwi Browser
- Open Kiwi Browser
- Go to Menu → Extensions → Enable Developer Mode
- Tap "Load Unpacked" → Select extracted folder

### 🔓 Step 3: Generate AppState
- Login to Facebook inside Kiwi
- Tap the C3C Extension → Generate AppState
- Copy the generated JSON data

### 💾 Step 4: Use in Your Bot
- Paste data inside `appstate.json` in your bot folder
- Run bot with `node index.js` or `npm start`

---

## 🚨 Important
> 🔒 Keep your `appstate.json` **private** – never share it.

---

## 📌 Version Info
- **Current Version:** `2.4.0`
- ⚠️ Changing this version in config will show an error

---

## 🤝 Credits & Links

- 💻 **Developer:** [BaYjid](https://github.com/BAYJID-00)
- 📦 **Based On:** `xass-fca`, `express`, `figlet`, `axios`
- 📎 **GitHub Repo:** [XASS Bot](https://github.com/XASS-BOT/XASS-FB-BOT)
- 📚 **Docs:** Available soon...

---

> 🙏 If you like this bot, give it a ⭐ on GitHub and share with friends!
