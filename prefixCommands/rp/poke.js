const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'poke',
    execute(message, args) {
        const target = message.mentions.users.first();
        const embed = new EmbedBuilder().setColor('Random');
        if (target) { embed.setDescription('<@' + message.author.id + '> **poked** ' + target + '! 🎭'); }
        else { embed.setDescription('<@' + message.author.id + '> **poked**! 🎭'); }
        message.channel.send({ embeds: [embed] });
    }
};