
const {
    Client,
    LocalAuth
} = require("whatsapp-web.js");

const qrcode = require("qrcode-terminal");
const axios = require("axios");
const fs = require("fs");

// ============================================================
// CONFIG
// ============================================================

const OWNER_NUMBER = "254718763250";

const OWNER_NUMBERS = [
    "254xxxxxxxxx",
    "254xxxxxxxxx"
];

const GROQ_URL =
    "https://api.groq.com/openai/v1/chat/completions";

const MODEL =
    "openai/gpt-oss-120b";

const GROQ_API_KEY =
    process.env.GROQ_API_KEY;


// ============================================================
// FILES
// ============================================================

const MEMORY_FILE =
    "memory.json";

const GROUP_MEMORY_FILE =
    "group_memory.json";

const BLOCKED_FILE =
    "blocked_numbers.json";


// ============================================================
// MEMORY
// ============================================================

let memory = {};
let groupMemory = {};
let blockedNumbers = [];


// ============================================================
// LOAD PRIVATE MEMORY
// ============================================================

try {

    if (fs.existsSync(MEMORY_FILE)) {

        memory =
            JSON.parse(
                fs.readFileSync(
                    MEMORY_FILE,
                    "utf8"
                )
            );
    }

} catch (error) {

    console.log(
        "[MEMORY] Load error:",
        error.message
    );

    memory = {};
}


// ============================================================
// LOAD GROUP MEMORY
// ============================================================

try {

    if (fs.existsSync(GROUP_MEMORY_FILE)) {

        groupMemory =
            JSON.parse(
                fs.readFileSync(
                    GROUP_MEMORY_FILE,
                    "utf8"
                )
            );
    }

} catch (error) {

    console.log(
        "[GROUP MEMORY] Load error:",
        error.message
    );

    groupMemory = {};
}


// ============================================================
// LOAD BLOCKED NUMBERS
// ============================================================

try {

    if (fs.existsSync(BLOCKED_FILE)) {

        blockedNumbers =
            JSON.parse(
                fs.readFileSync(
                    BLOCKED_FILE,
                    "utf8"
                )
            );
    }

} catch (error) {

    console.log(
        "[BLOCK] Load error:",
        error.message
    );

    blockedNumbers = [];
}


// ============================================================
// SAVE MEMORY
// ============================================================

function saveMemory() {

    try {

        fs.writeFileSync(
            MEMORY_FILE,
            JSON.stringify(
                memory,
                null,
                2
            )
        );

    } catch (error) {

        console.log(
            "[MEMORY] Save error:",
            error.message
        );
    }
}


// ============================================================
// SAVE GROUP MEMORY
// ============================================================

function saveGroupMemory() {

    try {

        fs.writeFileSync(
            GROUP_MEMORY_FILE,
            JSON.stringify(
                groupMemory,
                null,
                2
            )
        );

    } catch (error) {

        console.log(
            "[GROUP MEMORY] Save error:",
            error.message
        );
    }
}


// ============================================================
// SAVE BLOCKED NUMBERS
// ============================================================

function saveBlocked() {

    try {

        fs.writeFileSync(
            BLOCKED_FILE,
            JSON.stringify(
                blockedNumbers,
                null,
                2
            )
        );

    } catch (error) {

        console.log(
            "[BLOCK] Save error:",
            error.message
        );
    }
}


// ============================================================
// NORMALIZE PHONE NUMBER
// ============================================================

function normalizeNumber(number) {

    if (!number) {
        return "";
    }

    let value =
        String(number)
            .replace("@c.us", "")
            .replace("@s.whatsapp.net", "")
            .replace("@lid", "")
            .replace(/\D/g, "");


    // Kenyan local number:
    // 0118376389 -> 254118376389

    if (
        value.startsWith("0") &&
        value.length === 10
    ) {

        value =
            "254" +
            value.substring(1);
    }


    return value;
}


// ============================================================
// OWNER CHECK
// ============================================================

function isOwner(number) {

    const normalized =
        normalizeNumber(number);

    return OWNER_NUMBERS.some(
        owner =>
            normalizeNumber(owner) ===
            normalized
    );
}


// ============================================================
// BLOCK CHECK
// ============================================================

function isBlocked(number) {

    const normalized =
        normalizeNumber(number);

    return blockedNumbers.some(
        blocked =>
            normalizeNumber(blocked) ===
            normalized
    );
}


// ============================================================
// ADD BLOCKED NUMBER
// ============================================================

function addBlocked(number) {

    const normalized =
        normalizeNumber(number);

    if (!normalized) {
        return false;
    }

    if (isBlocked(normalized)) {
        return false;
    }

    blockedNumbers.push(
        normalized
    );

    saveBlocked();

    return true;
}


// ============================================================
// REMOVE BLOCKED NUMBER
// ============================================================

function removeBlocked(number) {

    const normalized =
        normalizeNumber(number);

    const oldLength =
        blockedNumbers.length;

    blockedNumbers =
        blockedNumbers.filter(
            blocked =>
                normalizeNumber(blocked) !==
                normalized
        );

    if (
        blockedNumbers.length !==
        oldLength
    ) {

        saveBlocked();

        return true;
    }

    return false;
}


// ============================================================
// WHATSAPP CLIENT
// ============================================================

const client =
    new Client({

        authStrategy:
            new LocalAuth(),

        puppeteer: {

            headless: true,

            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox"
            ]
        }
    });


// ============================================================
// QR CODE
// ============================================================

client.on(
    "qr",
    qr => {

        console.log(
            "\nScan this QR code:\n"
        );

        qrcode.generate(
            qr,
            {
                small: true
            }
        );
    }
);


// ============================================================
// AUTHENTICATED
// ============================================================

client.on(
    "authenticated",
    () => {

        console.log(
            "[AUTH] WhatsApp authenticated."
        );
    }
);


// ============================================================
// READY
// ============================================================

client.on(
    "ready",
    () => {

        console.log(
            "\n===================================="
        );

        console.log(
            `${BOT_NAME} is ready!`
        );

        console.log(
            `Ollama model: ${MODEL}`
        );

        console.log(
            "Ollama API: Cloud"
        );

        console.log(
            `Owner: ${OWNER_NUMBER}`
        );

        console.log(
            `Authorized numbers: ${OWNER_NUMBERS.join(
                ", "
            )}`
        );

        console.log(
            "====================================\n"
        );
    }
);


// ============================================================
// DISCONNECTED
// ============================================================

client.on(
    "disconnected",
    reason => {

        console.log(
            "[DISCONNECTED]",
            reason
        );
    }
);


// ============================================================
// NATURAL DELAY
// ============================================================

async function naturalDelay(text) {

    const delay = Math.min(
        8000,
        Math.max(
            2000,
            String(text || "").length * 35
        )
    );

    await new Promise(
        resolve =>
            setTimeout(
                resolve,
                delay
            )
    );
}


// ============================================================
// LID -> PHONE NUMBER
// ============================================================

async function resolvePhoneNumber(message) {

    const senderId =
        message.from;

    console.log(
        `[RESOLVE] Sender ID: ${senderId}`
    );


    // --------------------------------------------------------
    // Normal WhatsApp phone ID
    // --------------------------------------------------------

    if (
        senderId.endsWith("@c.us") ||
        senderId.endsWith("@s.whatsapp.net")
    ) {

        const number =
            normalizeNumber(
                senderId
            );

        console.log(
            `[RESOLVE] Normal phone -> ${number}`
        );

        return number;
    }


    // --------------------------------------------------------
    // WhatsApp LID
    // --------------------------------------------------------

    if (
        senderId.endsWith("@lid")
    ) {

        try {

            /*
             * IMPORTANT:
             *
             * getContactLidAndPhone()
             * expects an ARRAY.
             *
             * It returns:
             *
             * [
             *   {
             *      lid: "...",
             *      pn: "254..."
             *   }
             * ]
             */

            if (
                typeof client.getContactLidAndPhone ===
                "function"
            ) {

                const result =
                    await client.getContactLidAndPhone(
                        [senderId]
                    );


                console.log(
                    "[LID RESULT]",
                    JSON.stringify(
                        result
                    )
                );


                if (
                    Array.isArray(result) &&
                    result.length > 0
                ) {

                    const mapping =
                        result.find(
                            item =>
                                item &&
                                (
                                    item.lid ===
                                    senderId ||
                                    item.lid ===
                                    senderId.replace(
                                        "@lid",
                                        ""
                                    )
                                )
                        ) ||
                        result[0];


                    if (
                        mapping &&
                        mapping.pn
                    ) {

                        const number =
                            normalizeNumber(
                                mapping.pn
                            );


                        if (number) {

                            console.log(
                                `[LID] Resolved ${senderId} -> ${number}`
                            );

                            return number;
                        }
                    }
                }
            }

        } catch (error) {

            console.log(
                "[LID] Mapping error:",
                error.message
            );
        }


        // ----------------------------------------------------
        // CONTACT FALLBACK
        // ----------------------------------------------------

        try {

            const contact =
                await message.getContact();


            console.log(
                "[CONTACT]",
                JSON.stringify({
                    id:
                        contact?.id?._serialized,

                    number:
                        contact?.number,

                    name:
                        contact?.name,

                    pushname:
                        contact?.pushname
                })
            );


            if (
                contact?.number &&
                !String(
                    contact.number
                ).includes("@lid")
            ) {

                const number =
                    normalizeNumber(
                        contact.number
                    );


                if (number) {

                    console.log(
                        `[CONTACT] Resolved -> ${number}`
                    );

                    return number;
                }
            }

        } catch (error) {

            console.log(
                "[CONTACT] Resolution error:",
                error.message
            );
        }


        // ----------------------------------------------------
        // LID COULD NOT BE RESOLVED
        // ----------------------------------------------------

        console.log(
            `[LID] Could not resolve ${senderId}`
        );

        return "";
    }


    // --------------------------------------------------------
    // FALLBACK
    // --------------------------------------------------------

    const fallback =
        normalizeNumber(
            senderId
        );

    console.log(
        `[FALLBACK] Using message.from -> ${fallback}`
    );

    return fallback;
}


// ============================================================
// REMOVE OWNER MENTION
// ============================================================

function removeOwnerMention(text) {

    if (!text) {
        return "";
    }

    let cleaned = text;


    cleaned =
        cleaned.replace(
            new RegExp(
                `@${normalizeNumber(
                    OWNER_NUMBER
                )}`,
                "g"
            ),
            ""
        );


    cleaned =
        cleaned.replace(
            /@\d{7,15}/g,
            ""
        );


    return cleaned
        .replace(/\s+/g, " ")
        .trim();
}


// ============================================================
// SYSTEM PROMPT
// ============================================================

function systemPrompt() {

    return `
You are Athur, a WhatsApp AI assistant.

You chat naturally with people in Kenya.

Style:
	Speak naturally, like someone chatting on WhatsApp.
	Use Kenyan English, Kiswahili and Sheng naturally, depending on how the other person speaks.
	Do not say "how can i help you ?, how can i assist you ? and many more when the user greets you"
	Do not ask those questions of how can i help you or related in any part of the conversion
	Avoid sounding like a customer-care agent or formal assistant.
	Flow with the conversiton perfectly and know where to stop.
	Avoid unnecessarily explaining simple things.
	Remember the context of the conversation and avoid repeating itself.
	Use emojis occasionally, not in every message.
	Give short, natural replies rather than forcing every response into a fixed format.
`;
}


// ============================================================
// OLLAMA CLOUD
// ============================================================

// ============================================================
// GROQ CLOUD
// ============================================================

async function askAI(messages) {

    try {

        if (!GROQ_API_KEY) {

            console.log(
                "[GROQ] Missing GROQ_API_KEY."
            );

            return null;
        }

        const response =
            await axios.post(

                GROQ_URL,

                {
                    model: MODEL,

                    messages,

                    temperature: 0.2,

                    max_tokens: 120,

                    frequency_penalty: 0.15
                },

                {
                    headers: {

                        Authorization:
                            `Bearer ${GROQ_API_KEY}`,

                        "Content-Type":
                            "application/json"
                    },

                    timeout: 120000
                }
            );

        return (
            response.data?.choices?.[0]?.message?.content ||
            ""
        ).trim();

    } catch (error) {

        console.log(
            "[GROQ ERROR]",
            error.response?.data ||
            error.message
        );

        return null;
    }
}


// ============================================================
// PRIVATE MEMORY
// ============================================================

function getPrivateHistory(number) {

    if (!memory[number]) {

        memory[number] = [];
    }

    return memory[number];
}


function addPrivateMessage(
    number,
    role,
    content
) {

    const history =
        getPrivateHistory(
            number
        );


    history.push({
        role,
        content
    });


    if (
        history.length > 20
    ) {

        history.splice(
            0,
            history.length - 20
        );
    }


    saveMemory();
}


// ============================================================
// GROUP MEMORY
// ============================================================

function getGroupHistory(groupId) {

    if (!groupMemory[groupId]) {

        groupMemory[groupId] = [];
    }

    return groupMemory[groupId];
}


function addGroupMessage(
    groupId,
    role,
    content
) {

    const history =
        getGroupHistory(
            groupId
        );


    history.push({
        role,
        content
    });


    if (
        history.length > 20
    ) {

        history.splice(
            0,
            history.length - 20
        );
    }


    saveGroupMemory();
}


// ============================================================
// MESSAGE HANDLER
// ============================================================

client.on(
    "message",
    async message => {

        try {

            // Ignore bot's own messages
            if (message.fromMe) {
                return;
            }


            const isGroup =
                message.from.endsWith(
                    "@g.us"
                );


            // =================================================
            // RESOLVE REAL PHONE NUMBER
            // =================================================

            const number =
                await resolvePhoneNumber(
                    message
                );


            console.log(
                `[MESSAGE] From: ${message.from} | Resolved: ${number || "UNKNOWN"}`
            );


            // =================================================
            // PRIVATE BLOCK CHECK
            // =================================================

            if (
                !isGroup &&
                number &&
                isBlocked(number)
            ) {

                console.log(
                    `[BLOCKED] Ignoring ${number}`
                );

                return;
            }


            // =================================================
            // GROUP
            // =================================================

            if (isGroup) {

                const body =
                    String(
                        message.body || ""
                    ).trim();


                let ownerMentioned =
                    false;


                // Check mentionedIds
                if (
                    Array.isArray(
                        message.mentionedIds
                    )
                ) {

                    ownerMentioned =
                        message.mentionedIds.some(
                            id =>
                                normalizeNumber(
                                    id
                                ) ===
                                normalizeNumber(
                                    OWNER_NUMBER
                                )
                        );
                }


                // Check mentionedJidList
                if (
                    !ownerMentioned &&
                    Array.isArray(
                        message.mentionedJidList
                    )
                ) {

                    ownerMentioned =
                        message.mentionedJidList.some(
                            id =>
                                normalizeNumber(
                                    id
                                ) ===
                                normalizeNumber(
                                    OWNER_NUMBER
                                )
                        );
                }


                // Check literal mention
                if (
                    !ownerMentioned &&
                    body.includes(
                        `@${OWNER_NUMBER}`
                    )
                ) {

                    ownerMentioned = true;
                }


                // ---------------------------------------------
                // OWNER MENTIONED
                // ---------------------------------------------

                if (ownerMentioned) {

                    const cleaned =
                        removeOwnerMention(
                            body
                        );


                    if (!cleaned) {
                        return;
                    }


                    const chat =
                        await message.getChat();


                    const groupId =
                        chat.id._serialized;


                    const history =
                        getGroupHistory(
                            groupId
                        );


                    addGroupMessage(
                        groupId,
                        "user",
                        cleaned
                    );


                    const aiMessages = [

                        {
                            role: "system",

                            content:
                                systemPrompt()
                        },

                        ...history.slice(-20)
                    ];


                    const reply =
                        await askAI(
                            aiMessages
                        );


                    if (!reply) {
                        return;
                    }


                    addGroupMessage(
                        groupId,
                        "assistant",
                        reply
                    );


                    await naturalDelay(
                        reply
                    );


                    await message.reply(
                        reply
                    );


                    return;
                }


                // ---------------------------------------------
                // RANDOM GROUP REPLY
                // ---------------------------------------------

                if (
                    Math.random() >
                    0.40
                ) {

                    return;
                }


                if (!body) {
                    return;
                }


                const chat =
                    await message.getChat();


                const groupId =
                    chat.id._serialized;


                const history =
                    getGroupHistory(
                        groupId
                    );


                addGroupMessage(
                    groupId,
                    "user",
                    body
                );


                const aiMessages = [

                    {
                        role: "system",

                        content:
                            systemPrompt()
                    },

                    ...history.slice(-20)
                ];


                const reply =
                    await askAI(
                        aiMessages
                    );


                if (!reply) {
                    return;
                }


                addGroupMessage(
                    groupId,
                    "assistant",
                    reply
                );


                await naturalDelay(
                    reply
                );


                await message.reply(
                    reply
                );


                return;
            }


            // =================================================
            // PRIVATE MESSAGE
            // =================================================

            const body =
                String(
                    message.body || ""
                ).trim();


            if (!body) {
                return;
            }


            // =================================================
            // BLOCK
            // =================================================

            if (
                body.startsWith(
                    "/block"
                )
            ) {

                console.log(
                    "\n[ADMIN CHECK]"
                );

                console.log(
                    `Sender: ${number}`
                );

                console.log(
                    `Normalized: ${normalizeNumber(number)}`
                );

                console.log(
                    `Authorized: ${isOwner(number)}`
                );

                console.log(
                    `Authorized numbers: ${OWNER_NUMBERS.join(
                        ", "
                    )}`
                );


                if (!isOwner(number)) {

                    await message.reply(
                        "❌ You are not authorized to use this command."
                    );

                    return;
                }


                const parts =
                    body.split(
                        /\s+/
                    );


                const numberToBlock =
                    normalizeNumber(
                        parts[1]
                    );


                if (!numberToBlock) {

                    await message.reply(
                        "Usage: /block 2547XXXXXXXXX"
                    );

                    return;
                }


                // Don't allow owners to block owners
                if (
                    OWNER_NUMBERS.some(
                        owner =>
                            normalizeNumber(
                                owner
                            ) ===
                            numberToBlock
                    )
                ) {

                    await message.reply(
                        "❌ You cannot block an authorized owner number."
                    );

                    return;
                }


                if (
                    addBlocked(
                        numberToBlock
                    )
                ) {

                    await message.reply(
                        `✅ Blocked ${numberToBlock}`
                    );

                } else {

                    await message.reply(
                        `ℹ️ ${numberToBlock} is already blocked.`
                    );
                }


                return;
            }


            // =================================================
            // UNBLOCK
            // =================================================

            if (
                body.startsWith(
                    "/unblock"
                )
            ) {

                if (!isOwner(number)) {

                    await message.reply(
                        "❌ You are not authorized to use this command."
                    );

                    return;
                }


                const parts =
                    body.split(
                        /\s+/
                    );


                const numberToUnblock =
                    normalizeNumber(
                        parts[1]
                    );


                if (!numberToUnblock) {

                    await message.reply(
                        "Usage: /unblock 2547XXXXXXXXX"
                    );

                    return;
                }


                if (
                    removeBlocked(
                        numberToUnblock
                    )
                ) {

                    await message.reply(
                        `✅ Unblocked ${numberToUnblock}`
                    );

                } else {

                    await message.reply(
                        `ℹ️ ${numberToUnblock} is not blocked.`
                    );
                }


                return;
            }


            // =================================================
            // BLOCKED LIST
            // =================================================

            if (
                body ===
                "/blocked"
            ) {

                if (!isOwner(number)) {

                    await message.reply(
                        "❌ You are not authorized to use this command."
                    );

                    return;
                }


                if (
                    blockedNumbers.length ===
                    0
                ) {

                    await message.reply(
                        "📋 No blocked numbers."
                    );

                    return;
                }


                const list =
                    blockedNumbers
                        .map(
                            (n, i) =>
                                `${i + 1}. ${n}`
                        )
                        .join("\n");


                await message.reply(
                    `📋 Blocked numbers:\n\n${list}`
                );


                return;
            }


            // =================================================
            // STOP
            // =================================================

            if (
                body ===
                "/stop"
            ) {

                if (!isOwner(number)) {

                    await message.reply(
                        "❌ You are not authorized to use this command."
                    );

                    return;
                }


                await message.reply(
                    "🛑 Bot stopping..."
                );


                setTimeout(
                    () => {
                        process.exit(0);
                    },
                    1000
                );


                return;
            }


            // =================================================
            // START
            // =================================================

            if (
                body ===
                "/start"
            ) {

                if (!isOwner(number)) {

                    await message.reply(
                        "❌ You are not authorized to use this command."
                    );

                    return;
                }


                await message.reply(
                    "✅ Athur is already running."
                );


                return;
            }


            // =================================================
            // CLEAR
            // =================================================

            if (
                body ===
                "/clear"
            ) {

                if (!isOwner(number)) {

                    await message.reply(
                        "❌ You are not authorized to use this command."
                    );

                    return;
                }


                memory[number] = [];

                saveMemory();


                await message.reply(
                    "🧹 Your conversation memory has been cleared."
                );


                return;
            }


            // =================================================
            // MEMORIES
            // =================================================

            if (
                body ===
                "/memories"
            ) {

                const memories =
                    memory[number] || [];


                if (
                    memories.length ===
                    0
                ) {

                    await message.reply(
                        "🧠 No conversation memory yet."
                    );

                    return;
                }


                const output =
                    memories
                        .slice(-10)
                        .map(
                            item =>
                                `${item.role}: ${item.content}`
                        )
                        .join("\n");


                await message.reply(
                    `🧠 Recent memory:\n\n${output}`
                );


                return;
            }


            // =================================================
            // REMEMBER
            // =================================================

            if (
                body.startsWith(
                    "/remember"
                )
            ) {

                const text =
                    body
                        .replace(
                            /^\/remember\s*/i,
                            ""
                        )
                        .trim();


                if (!text) {

                    await message.reply(
                        "Usage: /remember something"
                    );

                    return;
                }


                addPrivateMessage(
                    number,
                    "user",
                    `[Remember] ${text}`
                );


                await message.reply(
                    "🧠 I'll remember that."
                );


                return;
            }


            // =================================================
            // FORGET
            // =================================================

            if (
                body.startsWith(
                    "/forget"
                )
            ) {

                const text =
                    body
                        .replace(
                            /^\/forget\s*/i,
                            ""
                        )
                        .trim();


                if (!text) {

                    await message.reply(
                        "Usage: /forget something"
                    );

                    return;
                }


                const history =
                    getPrivateHistory(
                        number
                    );


                memory[number] =
                    history.filter(
                        item =>
                            !item.content
                                .toLowerCase()
                                .includes(
                                    text.toLowerCase()
                                )
                    );


                saveMemory();


                await message.reply(
                    "🧹 Done."
                );


                return;
            }


            // =================================================
            // PRIVATE AI
            // =================================================

            addPrivateMessage(
                number,
                "user",
                body
            );


            const history =
                getPrivateHistory(
                    number
                );


            const aiMessages = [

                {
                    role: "system",

                    content:
                        systemPrompt()
                },

                ...history.slice(-20)
            ];


            const reply =
                await askAI(
                    aiMessages
                );


            if (!reply) {

                await message.reply(
                    "⚠️ AI is unavailable right now."
                );

                return;
            }


            addPrivateMessage(
                number,
                "assistant",
                reply
            );


            await naturalDelay(
                reply
            );


            await message.reply(
                reply
            );

        } catch (error) {

            console.log(
                "[MESSAGE ERROR]",
                error
            );
        }
    }
);


// ============================================================
// START BOT
// ============================================================

console.log(
    "Starting WhatsApp AI bot..."
);

console.log(
    `Groq model: ${MODEL}`
);

console.log(
    "Groq API: Cloud"
);

console.log("[WHATSAPP] Initializing client...");

client.initialize().catch(error => {
    console.error("[WHATSAPP INITIALIZATION ERROR]", error);
});
