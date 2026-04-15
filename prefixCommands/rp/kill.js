const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'kill',
    execute(message, args) {
        const target = message.mentions.users.first();
        const embed = new EmbedBuilder().setColor('Random');
        if (target) { embed.setDescription('<@' + message.author.id + '> **killed** ' + target + '! 🎭'); }
        else { embed.setDescription('<@' + message.author.id + '> **killed**! 🎭'); }
        message.channel.send({ embeds: [embed] });
    }
};