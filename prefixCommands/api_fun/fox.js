const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'fox',
    async execute(message) {
        try {
            const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
            const response = await fetch('https://randomfox.ca/floof/');
            const data = await response.json();
            const result = data.image;
            const embed = new EmbedBuilder().setTitle('🦊 Fox!').setColor('Random');
            if(typeof result === 'string' && result.startsWith('http')) embed.setImage(result);
            else embed.setDescription(String(result));
            message.channel.send({ embeds: [embed] });
        } catch(e) {
            message.channel.send('Could not connect to the API.');
        }
    }
};