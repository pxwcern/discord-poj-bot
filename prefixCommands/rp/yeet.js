const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'yeet',
    execute(message, args) {
        const target = message.mentions.users.first();
        const embed = new EmbedBuilder().setColor('Random');
        if (target) { embed.setDescription('<@' + message.author.id + '> **yeeted** ' + target + '! 🎭'); }
        else { embed.setDescription('<@' + message.author.id + '> **yeeted**! 🎭'); }
        message.channel.send({ embeds: [embed] });
    }
};