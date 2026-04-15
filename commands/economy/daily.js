const { SlashCommandBuilder } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Claim your daily reward!'),
    async execute(interaction) {
        const userId = interaction.user.id;
        
        let row = db.prepare('SELECT * FROM users_eco WHERE userId = ?').get(userId);
        if (!row) {
            db.prepare('INSERT INTO users_eco (userId) VALUES (?)').run(userId);
            row = { balance: 0, lastDaily: 0, lastWork: 0 };
        }

        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (now - row.lastDaily < oneDay) {
            const timeLeft = Math.ceil((oneDay - (now - row.lastDaily)) / (60 * 60 * 1000));
            return interaction.reply({ content: `You already claimed your daily reward. Please come back in **${timeLeft} hours**.`, ephemeral: true });
        }

        const reward = 500;
        db.prepare('UPDATE users_eco SET balance = balance + ?, lastDaily = ? WHERE userId = ?').run(reward, now, userId);

        interaction.reply(`🎁 Excellent! You collected your daily reward of **$${reward}**. Your new balance is: **$${row.balance + reward}**`);
    }
};
