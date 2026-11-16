# Athur – AI-Powered WhatsApp Assistant

**Athur** is an intelligent, AI-powered WhatsApp assistant built with JavaScript and Node.js. It integrates directly with WhatsApp through the `whatsapp-web.js` library and uses large language models (LLMs) to provide natural, human-like conversations.

Unlike traditional rule-based WhatsApp bots, Athur is designed to communicate naturally, understand conversational context, maintain memories, and adapt its responses to different communication styles.

### Key Features

- **AI-Powered Conversations:** Uses cloud-based AI models to generate intelligent, context-aware responses.
- **Human-Like Communication:** Supports Kenyan English, Kiswahili, and Sheng, with natural expressions, casual language, and occasional emojis.
- **Context Awareness:** Maintains conversational history to provide relevant and continuous interactions.
- **Persistent Memory:** Stores useful information from previous conversations to improve future interactions.
- **Private Chat Management:** Allows selective handling of individual WhatsApp conversations.
- **Group Intelligence:** Supports configurable group interactions, including responding when the bot is mentioned by actual contacts.
- **Contact Management:** Includes commands for blocking, unblocking, and managing contacts.
- **Conversation Controls:** Supports commands such as `/start`, `/stop`, `/block`, `/unblock`, and `/blocked`.
- **Privacy Controls:** Provides configurable rules for determining which conversations the assistant can handle.

### Technology Stack

- **Language:** JavaScript
- **Runtime:** Node.js
- **WhatsApp Integration:** whatsapp-web.js
- **AI Integration:** Cloud-based Large Language Models (LLMs)
- **Memory Management:** JSON-based persistent storage
- **Browser Automation:** Puppeteer

### Project Objective

The objective of Athur is to explore the integration of artificial intelligence into everyday communication by creating a conversational assistant capable of interacting naturally through WhatsApp.

The project combines AI, natural language processing, automation, and persistent memory to demonstrate how intelligent agents can improve digital communication.

**Project Type:** Artificial Intelligence | Chatbot Development | WhatsApp Automation | Natural Language Processing

## Installation 
## Installation

### Requirements

- Node.js (LTS)
- npm
- Git
- WhatsApp account
- Internet connection

### Clone the repository

git clone https://github.com/USERNAME/athur-ai-whatsapp-assistant.git

### Enter project directory

cd athur-ai-whatsapp-assistant

### Install dependencies

npm install

### Configure environment variables

Copy .env.example to .env and configure your API credentials.

### Start Athur

In the working directory, run this command to start the bot.
node index.js
