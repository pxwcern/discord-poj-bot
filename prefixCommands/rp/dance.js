const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'dance',
    execute(message, args) {
        const target = message.mentions.users.first();
        const embed = new EmbedBuilder().setColor('Random');
        if (target) { embed.setDescription('<@' + message.author.id + '> **danced with** ' + target + '! 🎭'); }
        else { embed.setDescription('<@' + message.author.id + '> **danced with**! 🎭'); }
        message.channel.send({ embeds: [embed] });
    }
};