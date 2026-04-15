const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Nukes the current channel (clones and deletes it).')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const { channel } = interaction;
        
        try {
            await interaction.reply({ content: 'Nuking this channel... ☢️', ephemeral: true });
            
            const position = channel.position;
            const newChannel = await channel.clone();
            
            await newChannel.setPosition(position);
            await channel.delete('Channel nuked.');
            
            await newChannel.send({ content: 'This channel has been nuked! ☢️', files: ['https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHYzeXh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/HwozO7/giphy.gif'] });
        } catch (e) {
            console.error(e);
            if (!interaction.replied) {
                await interaction.reply({ content: 'Failed to nuke channel. Ensure I have "Manage Channels" permission.', ephemeral: true });
            }
        }
    },
};
