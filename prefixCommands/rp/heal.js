const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'heal',
    execute(message, args) {
        const target = message.mentions.users.first();
        const embed = new EmbedBuilder().setColor('Random');
        if (target) { embed.setDescription('<@' + message.author.id + '> **healed** ' + target + '! 🎭'); }
        else { embed.setDescription('<@' + message.author.id + '> **healed**! 🎭'); }
        message.channel.send({ embeds: [embed] });
    }
};