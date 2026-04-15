const db = require('../../db');
const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'crime',
    execute(message) {
        let row = db.prepare('SELECT * FROM users_eco WHERE userId = ?').get(message.author.id);
        if(!row) return message.reply('No economy account! Create one by using \`/daily\`.');
        const earn = Math.floor(Math.random() * 200) - 50;
        db.prepare('UPDATE users_eco SET balance = balance + ? WHERE userId = ?').run(earn, message.author.id);
        message.channel.send({ embeds: [new EmbedBuilder().setDescription((earn > 0 ? 'YOU EARNED' : 'YOU LOST') + ' 💰: $' + earn).setColor(earn>0?'Green':'Red')] });
    }
};