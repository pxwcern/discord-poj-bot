const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'about',
    execute(message, args, client) {
        const embed = new EmbedBuilder()
            .setTitle('✨ About Me ✨')
            .setColor('DarkVividPink')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setDescription(`
Hello! I am a **highly advanced, multi-purpose Discord bot**.

**My Arsenal Includes:**
🚀 **90+ Unique Commands** (Slash & Prefix)
🛡️ **Premium Moderation Tools**
👻 **Advanced Ghost-Ping (POJ) Engine**
🎮 **Infinite Entertainment Options**

*I was engineered with precision and style. Try \`/help\` to see everything!*
            `)
            .addFields(
                { name: 'Developer', value: '\`Antigravity\`', inline: true },
                { name: 'Total Commands', value: `\`${client.commands.size + client.prefixCommands.size}+\``, inline: true }
            )
            .setFooter({ text: 'Always at your service!' })
            .setTimestamp();
            
        message.channel.send({ embeds: [embed] });
    }
};
