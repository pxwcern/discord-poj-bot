const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Shows information about this bot.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('✨ About Me ✨')
            .setColor('DarkVividPink')
            .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setDescription(`
Hello! I am a **highly advanced, multi-purpose Discord bot** designed to bring ultimate functionality and entertainment to this server.

**My Superpowers:**
🚀 **90+ Unique Commands**, natively bridging Slash and Prefix architecture!
🛡️ **Lightning-fast Moderation** including ultra-specific warnings and quick-action tools.
👻 **Advanced POJ System** to welcome and ghost-ping members seamlessly.
🎮 **Rich Entertainment Hub** providing hundreds of interactions, dice, and games.

I was crafted beautifully using **Discord.js v14** and powered by \`better-sqlite3\` for blazing fast local database processing.
            `)
            .addFields(
                { name: 'Developer', value: '\`pxwcern\`', inline: true },
                { name: 'Architecture', value: '\`Dual (Slash & Prefix)\`', inline: true },
                { name: 'Commands Count', value: `\`${interaction.client.commands.size + interaction.client.prefixCommands.size}+\``, inline: true }
            )
            .setFooter({ text: 'Ready to serve and dominate! 👑' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
