# 🤖 Advanced Multi-Purpose Discord Bot

A powerful, high-performance Discord bot built with **Discord.js v14** and **SQLite3**, designed to offer everything from advanced moderation to immersive leveling and persistent giveaway systems.

---

## 🚀 Key Features

### 🛡️ Advanced Moderation
Maintain full control over your server with lightning-fast tools:
- **Comprehensive Actions**: Ban, Kick, Timeout, Warn, and Clear commands.
- **Server Lockdown**: `/lockall` and `/unlockall` to manage emergency situations.
- **Channel Cleanup**: `/nuke` to instantly refresh channels and clear history.
- **Permissions**: `/role` management, `/nickname` controls, and `/unban` by ID.
- **Logging**: Dedicated mod-log system to track all actions.

### 📈 Leveling & Progression
Reward your active community members:
- **Dynamic XP**: Users gain XP by chatting (with smart cooldowns).
- **Role Rewards**: Automatically assign roles at specific levels with `/set-level-role`.
- **Admin Tools**: `/xp-admin` to manage user progress (add/set/reset).
- **Beautiful Rank Cards**: View progress with `/rank` and `/leaderboard`.

### 🎁 Persistent Giveaway System
Professional giveaways that survive bot restarts:
- **Button Interaction**: Sleek button-based entry system for better engagement.
- **Data Persistence**: All giveaway data is stored in SQLite, ensuring winners are always picked even after downtime.
- **Management Suite**: Commands like `/gend`, `/greroll`, `/glist`, and `/gdelete`.

### 🎫 Interactive Ticket System
Provide premium support to your members:
- **One-Click Setup**: Use `/ticket-setup` to deploy a support panel.
- **Management**: `/ticket-add`, `/ticket-remove`, and `/ticket-rename` for easier handling.
- **Transcripts**: Generate full text history of support tickets with `/ticket-transcript`.

### 💰 Economy & Games
Engage your users with a local economy:
- **Earning**: `/daily`, `/work`, and gambling games.
- **RPG Elements**: `/beg`, `/hunt`, `/fish`, and more.
- **Games**: Blackjack, Slots, Roulette, and Tictactoe.

---

## 🛠️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.11.0 or higher)
- [NPM](https://www.npmjs.com/)
- A Discord Bot Token (from the [Developer Portal](https://discord.com/developers/applications))

### Getting Started
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   TOKEN=YOUR_BOT_TOKEN_HERE
   ```

4. **Run the Bot**:
   ```bash
   node index.js
   ```

---

## 📂 Project Structure
- `commands/`: Slash commands categorized by module.
- `prefixCommands/`: Traditional prefix-based commands for ease of use.
- `events/`: Event handlers for interaction and message processing.
- `db.js` / `database.sqlite`: Persistent storage handling with `better-sqlite3`.

---

## 🤝 Contribution
Contributions are welcome! Feel free to open an issue or submit a pull request if you have ideas for new features or improvements.

## ⚖️ License
This project is licensed under the MIT License.
