const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'hug',
    execute(message, args) {
        const target = message.mentions.users.first();
        const embed = new EmbedBuilder().setColor('Random');
        if (target) { embed.setDescription('<@' + message.author.id + '> **hugged** ' + target + '! 🎭'); }
        else { embed.setDescription('<@' + message.author.id + '> **hugged**! 🎭'); }
        message.channel.send({ embeds: [embed] });
    }
};