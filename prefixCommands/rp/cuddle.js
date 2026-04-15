const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'cuddle',
    execute(message, args) {
        const target = message.mentions.users.first();
        const embed = new EmbedBuilder().setColor('Random');
        if (target) { embed.setDescription('<@' + message.author.id + '> **cuddled** ' + target + '! 🎭'); }
        else { embed.setDescription('<@' + message.author.id + '> **cuddled**! 🎭'); }
        message.channel.send({ embeds: [embed] });
    }
};