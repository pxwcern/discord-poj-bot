const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'shoot',
    execute(message, args) {
        const target = message.mentions.users.first();
        const embed = new EmbedBuilder().setColor('Random');
        if (target) { embed.setDescription('<@' + message.author.id + '> **shot** ' + target + '! 🎭'); }
        else { embed.setDescription('<@' + message.author.id + '> **shot**! 🎭'); }
        message.channel.send({ embeds: [embed] });
    }
};