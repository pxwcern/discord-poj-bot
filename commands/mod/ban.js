const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user from the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => option.setName('user').setDescription('The user to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the ban')),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided.';
        
        try {
            await interaction.guild.members.ban(user, { reason: `${interaction.user.tag}: ${reason}` });
            await interaction.reply({ content: `Successfully banned ${user.tag}. Reason: ${reason}`, ephemeral: true });
            
            // Log if set
            const logRow = db.prepare('SELECT channelId FROM mod_logs WHERE guildId = ?').get(interaction.guild.id);
            if (logRow) {
                const logChannel = interaction.guild.channels.cache.get(logRow.channelId);
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setTitle('User Banned')
                        .setColor('Red')
                        .addFields(
                            { name: 'User', value: `${user.tag} (${user.id})` },
                            { name: 'Moderator', value: `${interaction.user.tag}` },
                            { name: 'Reason', value: reason }
                        )
                        .setTimestamp();
                    logChannel.send({ embeds: [embed] }).catch(() => {});
                }
            }
            
        } catch (error) {
            await interaction.reply({ content: 'I cannot ban this user! I might lack permissions.', ephemeral: true });
        }
    },
};
