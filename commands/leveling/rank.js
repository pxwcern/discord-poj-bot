const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription("Shows your or someone else's current Level & XP.")
        .addUserOption(option => option.setName('user').setDescription('The user to check')),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const guildId = interaction.guild.id;

        const row = db.prepare('SELECT * FROM users_level WHERE guildId = ? AND userId = ?').get(guildId, user.id);
        const xp = row ? row.xp : 0;
        const level = row ? row.level : 0;
        const nextReq = (level + 1) * 300;

        const embed = new EmbedBuilder()
            .setTitle(`⭐ ${user.username}'s Profile`)
            .addFields(
                { name: 'Level', value: `${level}`, inline: true },
                { name: 'Current XP', value: `${xp} / ${nextReq}`, inline: true }
            )
            .setColor('DarkGold')
            .setThumbnail(user.displayAvatarURL());
            
        await interaction.reply({ embeds: [embed] });
    }
};
