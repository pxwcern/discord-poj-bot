const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warns a user and stores it in database.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => option.setName('user').setDescription('The user to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The warning reason').setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const guildId = interaction.guild.id;

        db.prepare('INSERT INTO warnings (guildId, userId, moderatorId, reason, timestamp) VALUES (?, ?, ?, ?, ?)').run(
            guildId, user.id, interaction.user.id, reason, Date.now()
        );

        await interaction.reply({ content: `Successfully warned ${user.tag}. Reason: ${reason}`, ephemeral: true });

        const logRow = db.prepare('SELECT channelId FROM mod_logs WHERE guildId = ?').get(interaction.guild.id);
        if (logRow) {
            const logChannel = interaction.guild.channels.cache.get(logRow.channelId);
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setTitle('User Warned')
                    .setColor('Yellow')
                    .addFields(
                        { name: 'User', value: `${user.tag}` },
                        { name: 'Reason', value: reason },
                        { name: 'Moderator', value: interaction.user.tag }
                    );
                logChannel.send({ embeds: [embed] }).catch(() => {});
            }
        }
    }
};
