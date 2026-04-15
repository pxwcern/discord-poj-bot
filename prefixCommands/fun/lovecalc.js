const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'lovecalc',
    execute(message, args, client) {
        const user1 = message.mentions.users.first() || message.author;
        const user2 = message.mentions.users.last() || message.author;
        
        if (user1.id === user2.id) {
            return message.channel.send('You need to mention someone else!');
        }
        
        const percent = Math.floor(Math.random() * 101);
        let emoji = '💖';
        if (percent < 25) emoji = '💔';
        else if (percent < 50) emoji = '❤️‍🩹';
        else if (percent < 80) emoji = '❤️';
        
        const embed = new EmbedBuilder()
            .setTitle(`Love Calculator ${emoji}`)
            .setDescription(`${user1} and ${user2} are **${percent}%** compatible!`)
            .setColor('Pink');
            
        message.channel.send({ embeds: [embed] });
    }
};
