const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlockall')
        .setDescription('Unlocks all text channels in the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        const channels = interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildText);
        let count = 0;

        for (const [id, channel] of channels) {
            try {
                await channel.permissionOverwrites.edit(interaction.guild.id, {
                    SendMessages: null // Resets to default/neutral
                });
                count++;
            } catch (e) {
                console.error(`Failed to unlock ${channel.name}`, e);
            }
        }

        await interaction.editReply({ content: `Successfully unlocked ${count} text channels.` });
    },
};
