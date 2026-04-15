const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the Top 10 XP Leaders of the server.'),
    async execute(interaction) {
        const rows = db.prepare('SELECT * FROM users_level WHERE guildId = ? ORDER BY level DESC, xp DESC LIMIT 10').all(interaction.guild.id);
        
        if (!rows || rows.length === 0) {
            return interaction.reply({ content: 'Nobody has earned any XP yet!', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('🏆 Server Leaderboard')
            .setColor('Gold');
            
        let board = '';
        rows.forEach((r, i) => {
            board += `**${i + 1}.** <@${r.userId}> - Level **${r.level}** (${r.xp} XP)\n`;
        });
        embed.setDescription(board);

        await interaction.reply({ embeds: [embed] });
    }
};
