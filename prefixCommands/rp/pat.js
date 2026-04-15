const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'pat',
    execute(message, args) {
        const target = message.mentions.users.first();
        const embed = new EmbedBuilder().setColor('Random');
        if (target) { embed.setDescription('<@' + message.author.id + '> **patted** ' + target + '! 🎭'); }
        else { embed.setDescription('<@' + message.author.id + '> **patted**! 🎭'); }
        message.channel.send({ embeds: [embed] });
    }
};