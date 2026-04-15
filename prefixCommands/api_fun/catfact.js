const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'catfact',
    async execute(message) {
        try {
            const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
            const response = await fetch('https://catfact.ninja/fact');
            const data = await response.json();
            const result = data.fact;
            const embed = new EmbedBuilder().setTitle('🐱 Cat Fact').setColor('Random');
            if(typeof result === 'string' && result.startsWith('http')) embed.setImage(result);
            else embed.setDescription(String(result));
            message.channel.send({ embeds: [embed] });
        } catch(e) {
            message.channel.send('Could not connect to the API.');
        }
    }
};