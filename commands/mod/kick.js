const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user from the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option => option.setName('user').setDescription('The user to kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the kick')),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided.';
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member) {
            return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
        }

        try {
            await member.kick(`${interaction.user.tag}: ${reason}`);
            await interaction.reply({ content: `Successfully kicked ${user.tag}. Reason: ${reason}`, ephemeral: true });
            
            const logRow = db.prepare('SELECT channelId FROM mod_logs WHERE guildId = ?').get(interaction.guild.id);
            if (logRow) {
                const logChannel = interaction.guild.channels.cache.get(logRow.channelId);
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setTitle('User Kicked')
                        .setColor('Orange')
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
            await interaction.reply({ content: 'I cannot kick this user! I might lack permissions.', ephemeral: true });
        }
    },
};
