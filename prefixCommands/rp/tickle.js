const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'tickle',
    execute(message, args) {
        const target = message.mentions.users.first();
        const embed = new EmbedBuilder().setColor('Random');
        if (target) { embed.setDescription('<@' + message.author.id + '> **tickled** ' + target + '! 🎭'); }
        else { embed.setDescription('<@' + message.author.id + '> **tickled**! 🎭'); }
        message.channel.send({ embeds: [embed] });
    }
};