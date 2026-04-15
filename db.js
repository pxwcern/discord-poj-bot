const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.sqlite'));

// Ghost Ping
db.prepare(`
  CREATE TABLE IF NOT EXISTS poj_channels (
    guildId TEXT,
    channelId TEXT,
    seconds INTEGER,
    PRIMARY KEY (guildId, channelId)
  )
`).run();

// Moderation
db.prepare(`
  CREATE TABLE IF NOT EXISTS mod_logs (
    guildId TEXT PRIMARY KEY,
    channelId TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS warnings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guildId TEXT,
    userId TEXT,
    moderatorId TEXT,
    reason TEXT,
    timestamp INTEGER
  )
`).run();

// Premium Systems
// Economy
db.prepare(`
  CREATE TABLE IF NOT EXISTS users_eco (
    userId TEXT PRIMARY KEY,
    balance INTEGER DEFAULT 0,
    lastDaily INTEGER DEFAULT 0,
    lastWork INTEGER DEFAULT 0
  )
`).run();

// Leveling
db.prepare(`
  CREATE TABLE IF NOT EXISTS users_level (
    guildId TEXT,
    userId TEXT,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 0,
    PRIMARY KEY (guildId, userId)
  )
`).run();

// Utility
db.prepare(`
  CREATE TABLE IF NOT EXISTS users_afk (
    userId TEXT PRIMARY KEY,
    reason TEXT,
    timestamp INTEGER
  )
`).run();

// Tickets
db.prepare(`
  CREATE TABLE IF NOT EXISTS tickets_config (
    guildId TEXT PRIMARY KEY,
    categoryId TEXT,
    roleId TEXT
  )
`).run();

// Welcome Channel Configuration
db.prepare(`
  CREATE TABLE IF NOT EXISTS welcome_channels (
    guildId TEXT PRIMARY KEY,
    channelId TEXT
  )
`).run();

// NEW TABLES FOR UPGRADES
// Leveling Role Rewards
db.prepare(`
  CREATE TABLE IF NOT EXISTS level_roles (
    guildId TEXT,
    level INTEGER,
    roleId TEXT,
    PRIMARY KEY (guildId, level)
  )
`).run();

// Leveling Settings
db.prepare(`
  CREATE TABLE IF NOT EXISTS leveling_settings (
    guildId TEXT PRIMARY KEY,
    channelId TEXT,
    toggle INTEGER DEFAULT 1
  )
`).run();

// Giveaways
db.prepare(`
  CREATE TABLE IF NOT EXISTS giveaways (
    messageId TEXT PRIMARY KEY,
    guildId TEXT,
    channelId TEXT,
    prize TEXT,
    winnersCount INTEGER,
    endTime INTEGER,
    hostedBy TEXT,
    status TEXT DEFAULT 'active'
  )
`).run();

// Giveaway Entries
db.prepare(`
  CREATE TABLE IF NOT EXISTS giveaway_entries (
    messageId TEXT,
    userId TEXT,
    PRIMARY KEY (messageId, userId)
  )
`).run();

module.exports = db;
