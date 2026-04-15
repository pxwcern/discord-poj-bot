const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lockall')
        .setDescription('Locks all text channels in the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        const channels = interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildText);
        let count = 0;

        for (const [id, channel] of channels) {
            try {
                await channel.permissionOverwrites.edit(interaction.guild.id, {
                    SendMessages: false
                });
                count++;
            } catch (e) {
                console.error(`Failed to lock ${channel.name}`, e);
            }
        }

        await interaction.editReply({ content: `Successfully locked ${count} text channels.` });
    },
};
