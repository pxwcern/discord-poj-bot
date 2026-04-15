const { SlashCommandBuilder } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Work random jobs to earn money (10m cooldown).'),
    async execute(interaction) {
        const userId = interaction.user.id;
        
        let row = db.prepare('SELECT * FROM users_eco WHERE userId = ?').get(userId);
        if (!row) {
            db.prepare('INSERT INTO users_eco (userId) VALUES (?)').run(userId);
            row = { balance: 0, lastDaily: 0, lastWork: 0 };
        }

        const now = Date.now();
        const cooldown = 10 * 60 * 1000;

        if (now - row.lastWork < cooldown) {
            const timeLeft = Math.ceil((cooldown - (now - row.lastWork)) / (60 * 1000));
            return interaction.reply({ content: `You are too tired! Take a break and try again in **${timeLeft} minutes**.`, ephemeral: true });
        }

        const reward = Math.floor(Math.random() * 150) + 50;
        const jobs = ["hacked the Pentagon", "delivered some hot pizzas", "wrote code for an AI", "traded stocks", "created a huge Discord Server"];
        const job = jobs[Math.floor(Math.random() * jobs.length)];

        db.prepare('UPDATE users_eco SET balance = balance + ?, lastWork = ? WHERE userId = ?').run(reward, now, userId);

        interaction.reply(`💼 You **${job}** and earned **$${reward}** instantly!`);
    }
};
