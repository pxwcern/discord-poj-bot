const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'dog',
    async execute(message) {
        try {
            const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await response.json();
            const result = data.message;
            const embed = new EmbedBuilder().setTitle('🐶 Woof!').setColor('Random');
            if(typeof result === 'string' && result.startsWith('http')) embed.setImage(result);
            else embed.setDescription(String(result));
            message.channel.send({ embeds: [embed] });
        } catch(e) {
            message.channel.send('Could not connect to the API.');
        }
    }
};