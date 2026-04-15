const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'revive',
    execute(message, args) {
        const target = message.mentions.users.first();
        const embed = new EmbedBuilder().setColor('Random');
        if (target) { embed.setDescription('<@' + message.author.id + '> **revived** ' + target + '! 🎭'); }
        else { embed.setDescription('<@' + message.author.id + '> **revived**! 🎭'); }
        message.channel.send({ embeds: [embed] });
    }
};