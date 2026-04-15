const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-log')
        .setDescription('Sets the moderation log channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel where logs will be sent')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const guildId = interaction.guild.id;

        db.prepare(`
            INSERT INTO mod_logs (guildId, channelId)
            VALUES (?, ?)
            ON CONFLICT(guildId) DO UPDATE SET channelId = excluded.channelId
        `).run(guildId, channel.id);

        await interaction.reply({ content: `Moderation log channel successfully set to <#${channel.id}>.`, ephemeral: true });
    },
};
