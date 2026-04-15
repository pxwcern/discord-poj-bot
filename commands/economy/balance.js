const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription("Shows your or someone else's wallet balance.")
        .addUserOption(option => option.setName('user').setDescription('The user to check')),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        
        let row = db.prepare('SELECT balance FROM users_eco WHERE userId = ?').get(user.id);
        const balance = row ? row.balance : 0;

        const embed = new EmbedBuilder()
            .setTitle(`🏦 ${user.username}'s Wallet`)
            .setDescription(`**Current Balance:** $${balance}`)
            .setColor('Green');

        interaction.reply({ embeds: [embed] });
    }
};
