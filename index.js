require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

client.commands = new Collection();
client.prefixCommands = new Collection();
client.prefix = 'b!';

// Load Slash Commands
const foldersPath = path.join(__dirname, 'commands');
if (!fs.existsSync(foldersPath)) fs.mkdirSync(foldersPath, { recursive: true });

try {
    const commandFolders = fs.readdirSync(foldersPath);
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        if(!fs.statSync(commandsPath).isDirectory()) continue;
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] Slash command at ${filePath} is missing required "data" or "execute" property.`);
            }
        }
    }
} catch (e) {
    console.error("Error loading slash commands:", e);
}


// Load Prefix Commands
const prefixPath = path.join(__dirname, 'prefixCommands');
if (!fs.existsSync(prefixPath)) fs.mkdirSync(prefixPath, { recursive: true });

try {
    const prefixFolders = fs.readdirSync(prefixPath);
    for (const folder of prefixFolders) {
        const commandsPath = path.join(prefixPath, folder);
        if(!fs.statSync(commandsPath).isDirectory()) continue;
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('name' in command && 'execute' in command) {
                client.prefixCommands.set(command.name, command);
            } else {
                console.log(`[WARNING] Prefix command at ${filePath} is missing required "name" or "execute" property.`);
            }
        }
    }
} catch (e) {
    console.error("Error loading prefix commands:", e);
}


// Load Events
const eventsPath = path.join(__dirname, 'events');
if (!fs.existsSync(eventsPath)) fs.mkdirSync(eventsPath, { recursive: true });

try {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
} catch (e) {
    console.error("Error loading events:", e);
}

client.login(process.env.TOKEN);
