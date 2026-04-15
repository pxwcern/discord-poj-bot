const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'kiss',
    execute(message, args) {
        const target = message.mentions.users.first();
        const embed = new EmbedBuilder().setColor('Random');
        if (target) { embed.setDescription('<@' + message.author.id + '> **kissed** ' + target + '! 🎭'); }
        else { embed.setDescription('<@' + message.author.id + '> **kissed**! 🎭'); }
        message.channel.send({ embeds: [embed] });
    }
};