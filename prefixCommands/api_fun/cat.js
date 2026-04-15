const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'cat',
    async execute(message) {
        try {
            const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
            const response = await fetch('https://api.thecatapi.com/v1/images/search');
            const data = await response.json();
            const result = data[0].url;
            const embed = new EmbedBuilder().setTitle('🐱 Meow!').setColor('Random');
            if (typeof result === 'string' && result.startsWith('http')) embed.setImage(result);
            else embed.setDescription(String(result));
            message.channel.send({ embeds: [embed] });
        } catch (e) {
            message.channel.send('Could not connect to the API.');
        }
    }
};