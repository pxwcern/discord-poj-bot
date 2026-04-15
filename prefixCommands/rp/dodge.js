const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'dodge',
    execute(message, args) {
        const target = message.mentions.users.first();
        const embed = new EmbedBuilder().setColor('Random');
        if (target) { embed.setDescription('<@' + message.author.id + '> **dodged** ' + target + '! 🎭'); }
        else { embed.setDescription('<@' + message.author.id + '> **dodged**! 🎭'); }
        message.channel.send({ embeds: [embed] });
    }
};