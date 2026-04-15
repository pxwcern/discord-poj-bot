const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Shows statistical and basic information regarding the server.'),
    async execute(interaction) {
        const guild = interaction.guild;
        const owner = await guild.fetchOwner();
        const embed = new EmbedBuilder()
            .setTitle(`🏢 ${guild.name} Info`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
            .addFields(
                { name: '👑 Owner', value: `${owner.user.tag}`, inline: true },
                { name: '📅 Created At', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
                { name: '👥 Total Members', value: `${guild.memberCount}`, inline: true },
                { name: '🎭 Total Roles', value: `${guild.roles.cache.size}`, inline: true }
            )
            .setColor('Random');
        await interaction.reply({ embeds: [embed] });
    }
};
