const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Shows detailed profile information of a user.')
        .addUserOption(option => option.setName('user').setDescription('The user to inspect')),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        const embed = new EmbedBuilder()
            .setTitle(`👤 ${user.username}'s Profile`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .addFields(
                { name: 'ID', value: `\`${user.id}\``, inline: false },
                { name: 'Discord Join Date', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
            )
            .setColor('Navy');
            
        if (member) {
            embed.addFields(
                { name: 'Server Join Date', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: 'Roles', value: member.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => r.toString()).join(' ') || 'No Roles', inline: false }
            );
        }
        await interaction.reply({ embeds: [embed] });
    }
};
