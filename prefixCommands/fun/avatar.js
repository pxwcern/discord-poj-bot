const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'avatar',
    execute(message, args, client) {
        const user = message.mentions.users.first() || message.author;
        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Avatar`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor('Random');
        message.channel.send({ embeds: [embed] });
    }
};
