const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeouts a user in the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => option.setName('user').setDescription('The user to timeout').setRequired(true))
        .addIntegerOption(option => option.setName('duration').setDescription('Duration in minutes').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for timeout')),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided.';
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member) return interaction.reply({ content: 'User not found in this server.', ephemeral: true });

        try {
            await member.timeout(duration * 60 * 1000, reason);
            await interaction.reply({ content: `Successfully timed out ${user.tag} for ${duration} minutes.`, ephemeral: true });

            const logRow = db.prepare('SELECT channelId FROM mod_logs WHERE guildId = ?').get(interaction.guild.id);
            if (logRow) {
                const logChannel = interaction.guild.channels.cache.get(logRow.channelId);
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setTitle('User Timed Out')
                        .setColor('Orange')
                        .addFields(
                            { name: 'User', value: `${user.tag}` },
                            { name: 'Duration', value: `${duration} mins` },
                            { name: 'Reason', value: reason }
                        );
                    logChannel.send({ embeds: [embed] }).catch(() => {});
                }
            }
        } catch (e) {
            await interaction.reply({ content: 'Failed to timeout user. Check my permissions and hierarchy.', ephemeral: true });
        }
    }
};
