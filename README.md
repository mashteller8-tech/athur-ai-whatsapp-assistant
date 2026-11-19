# Athur – AI-Powered WhatsApp Assistant

**Athur** is an intelligent, AI-powered WhatsApp assistant built with JavaScript and Node.js. It integrates directly with WhatsApp through the `whatsapp-web.js` library and uses Groq Cloud's Large Language Models (LLMs) to deliver natural, human-like conversations.

Unlike traditional rule-based WhatsApp bots, Athur understands conversational context, maintains persistent memories, and adapts its communication style to different users.

## Key Features

- **AI-Powered Conversations:** Uses Groq Cloud to generate intelligent, context-aware responses.
- **Human-Like Communication:** Supports Kenyan English, Kiswahili, and Sheng, with natural expressions and occasional emojis.
- **Context Awareness:** Maintains conversational history for continuous interactions.
- **Persistent Memory:** Stores useful information from previous conversations.
- **Private Chat Management:** Supports selective handling of individual WhatsApp conversations.
- **Group Intelligence:** Supports configurable group interactions and mention-based responses.
- **Contact Management:** Provides commands for blocking, unblocking, and managing contacts.
- **Conversation Controls:** Supports commands such as `/start`, `/stop`, `/block`, `/unblock`, and `/blocked`.
- **Privacy Controls:** Provides configurable rules for controlling which conversations Athur can handle.

## Technology Stack

| Component | Technology |
|---|---|
| Language | JavaScript |
| Runtime | Node.js |
| WhatsApp Integration | whatsapp-web.js |
| AI Provider | Groq Cloud |
| AI Model | openai/gpt-oss-120b |
| API Communication | Axios |
| Memory Management | JSON-based storage |
| Browser Automation | Puppeteer |

---

# Installation and Setup

Follow the instructions below in order. No programming experience is required to install and start Athur, provided the prerequisites are installed.

## 1. Requirements

Make sure you have:

- Node.js (LTS)
- npm
- Git
- An active WhatsApp account
- An internet connection
- A Groq API key

## 2. Get Your Groq API Key

Athur uses Groq Cloud to power its AI conversations.

1. Visit [Groq Console](https://console.groq.com/).
2. Create an account or sign in.
3. Navigate to the API Keys section.
4. Generate a new API key.
5. Copy and securely store your API key.

**Important:** Your API key is private. Never share it or upload it to GitHub.

Groq provides developer access subject to its applicable usage limits and pricing.

## 3. Clone the Repository

Open PowerShell, Windows Terminal, or your preferred terminal and execute:

```bash
git clone https://github.com/mashteller8-tech/athur-ai-whatsapp-assistant.git
```

## 4. Enter the Project Directory

```bash
cd athur-ai-whatsapp-assistant
```

## 5. Install Dependencies

Execute:

```bash
npm install
```

Wait for the installation process to finish.

This installs the dependencies required by Athur, including WhatsApp Web integration, Axios, QR code generation, and Puppeteer.

## 6. Configure Your Groq API Key

Athur reads its API key from an environment variable named `GROQ_API_KEY`.

### Windows PowerShell

Execute:

```powershell
setx GROQ_API_KEY "PASTE_YOUR_GROQ_API_KEY_HERE"
```

Replace `PASTE_YOUR_GROQ_API_KEY_HERE` with the API key you generated from Groq Console.

**IMPORTANT:** After executing this command:

1. Close your current terminal.
2. Open a new PowerShell terminal.
3. Navigate back to the Athur project directory.

The API key will now be available to Node.js through the environment.

### Linux / macOS

For Linux or macOS, execute:

```bash
export GROQ_API_KEY="PASTE_YOUR_GROQ_API_KEY_HERE"
```

This configures the key for the current terminal session.

### Verify API Key Configuration

In Windows PowerShell, execute:

```powershell
if ($env:GROQ_API_KEY) {
    Write-Host "Groq API key configured successfully."
} else {
    Write-Host "Groq API key not found."
}
```

Do not print or share your actual API key.

## 7. Start Athur

Once the API key and dependencies are configured, execute:

```bash
node index.js
```

Athur will initialize its WhatsApp client and display a QR code in the terminal.

## 8. Connect Your WhatsApp Account

Follow these steps:

1. Open WhatsApp on your smartphone.
2. Navigate to **Settings** or the WhatsApp menu.
3. Select **Linked Devices**.
4. Select **Link a Device**.
5. Scan the QR code displayed in your terminal.
6. Wait for the authentication process to complete.

Once authenticated, Athur will establish its WhatsApp connection.

You can now interact with Athur through authorized conversations.

---

# Running Athur Again

After the initial installation, you do not need to repeat the dependency installation or API configuration.

Open a terminal and execute:

```bash
cd athur-ai-whatsapp-assistant
node index.js
```

Your WhatsApp authentication session is saved locally, allowing Athur to reconnect without scanning another QR code, provided the session remains valid.

**Note:** If you use a new terminal or computer, ensure the `GROQ_API_KEY` environment variable is configured there as well.

---

# AI Configuration

Athur uses the following Groq Cloud configuration:

| Setting | Value |
|---|---|
| Provider | Groq Cloud |
| API Endpoint | https://api.groq.com/openai/v1/chat/completions |
| Model | openai/gpt-oss-120b |
| Authentication | Bearer API Key |
| Environment Variable | GROQ_API_KEY |

The AI integration uses an OpenAI-compatible chat completion interface through Axios.

The selected model can be changed in the application's AI configuration if another compatible model is required.

---
# usage
# Usage Guide

Once Athur is running and connected to WhatsApp, you can interact with it directly through your WhatsApp account.

## 1. Starting a Conversation

- Open WhatsApp.
- Find Athur's connected account.
- Send a message just like you would to another contact.
- open the main index.js and add the two authorized numbers
- failure to the above, you won't be able to use the commands 
- Athur will process your message using its configured AI model and respond naturally.

You can communicate using Kenyan English, Kiswahili, or Sheng.

## 2. Conversation Commands

Athur supports several commands for managing conversations and access permissions.

| Command | Description |
|---|---|
| `/start` | Activates or resumes conversations with Athur. |
| `/stop` | Stops Athur from responding in the relevant conversation. |
| `/block` | Blocks a contact from interacting with Athur. |
| `/unblock` | Removes a contact from the blocked list. |
| `/blocked` | Displays the list of blocked contacts. |

**Note:** Command availability and access permissions depend on the implementation and authorization rules configured in Athur.

## 3. Private Conversations

Athur can handle individual WhatsApp conversations according to its configured privacy rules.

- Send messages directly to Athur.
- Ask questions and receive AI-generated responses.
- Continue previous conversations with contextual awareness.
- Use supported conversation commands to control interactions.

## 4. Group Conversations

Athur supports configurable group interactions.

Depending on the group settings:

- Athur can respond when mentioned by actual WhatsApp contacts.
- Group interactions can use conversational context.
- Authorized users can interact with Athur according to configured permissions.

Group response behavior depends on the application's group interaction settings.

## 5. Persistent Memory

Athur supports persistent memory to maintain useful information across conversations.

This allows it to:

- Retain relevant information from previous interactions.
- Maintain conversational continuity.
- Use stored context when generating future responses.

Memory information is stored using the project's local JSON-based storage system.

## 6. Managing Blocked Contacts

Athur provides contact management commands for controlling who can interact with the assistant.

- Use `/block` to block an authorized contact.
- Use `/unblock` to restore access.
- Use `/blocked` to inspect blocked contacts.

Administrative commands are subject to the application's owner authorization rules.

## 7. Stopping Athur

To stop the running application, return to the terminal where Athur is running and press:

```bash
Ctrl + C
```

This terminates the current Node.js process.

To start Athur again, execute:

```bash
node index.js
```

## 8. Troubleshooting

| Problem | Possible Solution |
|---|---|
| Invalid API key | Verify your `GROQ_API_KEY` configuration. |
| AI responses not working | Check your internet connection and Groq API availability. |
| QR code not appearing | Restart Athur and check the terminal output. |
| WhatsApp connection failed | Check your internet connection and relink your device if necessary. |
| Module not found | Run `npm install` inside the project directory. |
| Athur is not responding | Check whether the application is running and whether the conversation is authorized. |
| Authentication expired | Reconnect WhatsApp by scanning a new QR code. |

---

**Enjoy using Athur!**

An AI-powered WhatsApp assistant designed to make everyday conversations smarter, more natural, and more interactive.

# Privacy and Security

Athur implements several mechanisms to help protect conversations and configuration data.

- API credentials should be stored in environment variables.
- Never commit API keys to public repositories.
- WhatsApp authentication sessions should remain private.
- Conversation memory is maintained locally using JSON storage.
- Contact blocking and conversation permissions help control bot interactions.
- Only configure access for conversations you authorize.

**Security Warning:** Anyone with access to your WhatsApp authentication session may be able to access your linked account. Keep the project directory and authentication files secure.

---

# Project Objective

The objective of Athur is to explore the integration of artificial intelligence into everyday communication by creating a conversational assistant capable of interacting naturally through WhatsApp.

The project combines artificial intelligence, natural language processing, automation, and persistent memory to demonstrate how intelligent agents can improve digital communication.

## Project Information

**Project Name:** Athur

**Project Type:** Artificial Intelligence | Chatbot Development | WhatsApp Automation | Natural Language Processing

**Programming Language:** JavaScript

**Runtime:** Node.js

**AI Provider:** Groq Cloud

**Repository:** https://github.com/mashteller8-tech/athur-ai-whatsapp-assistant

## Author

GitHub: https://github.com/mashteller8-tech

---

*Built with JavaScript, Node.js, Groq Cloud, and WhatsApp Web integration.*
