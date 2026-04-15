const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'slap',
    execute(message, args) {
        const target = message.mentions.users.first();
        const embed = new EmbedBuilder().setColor('Random');
        if (target) { embed.setDescription('<@' + message.author.id + '> **slapped** ' + target + '! 🎭'); }
        else { embed.setDescription('<@' + message.author.id + '> **slapped**! 🎭'); }
        message.channel.send({ embeds: [embed] });
    }
};