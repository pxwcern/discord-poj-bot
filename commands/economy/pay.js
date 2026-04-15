const { SlashCommandBuilder } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Transfer money from your wallet to someone else.')
        .addUserOption(option => option.setName('user').setDescription('User to send money to').setRequired(true))
        .addIntegerOption(option => option.setName('amount').setDescription('Amount to send').setRequired(true).setMinValue(1)),
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');
        const senderId = interaction.user.id;

        if (target.id === senderId) return interaction.reply({ content: "You cannot send money to yourself!", ephemeral: true });
        if (target.bot) return interaction.reply({ content: "You cannot send money to offline bots!", ephemeral: true });

        let senderRow = db.prepare('SELECT balance FROM users_eco WHERE userId = ?').get(senderId);
        if (!senderRow || senderRow.balance < amount) {
            return interaction.reply({ content: `You don't have **$${amount}** in your wallet! Insufficient funds.`, ephemeral: true });
        }

        db.prepare('UPDATE users_eco SET balance = balance - ? WHERE userId = ?').run(amount, senderId);
        
        let targetRow = db.prepare('SELECT balance FROM users_eco WHERE userId = ?').get(target.id);
        if (!targetRow) {
            db.prepare('INSERT INTO users_eco (userId, balance) VALUES (?, ?)').run(target.id, amount);
        } else {
            db.prepare('UPDATE users_eco SET balance = balance + ? WHERE userId = ?').run(amount, target.id);
        }

        interaction.reply(`💸 Success! You transferred **$${amount}** to ${target}.`);
    }
};
