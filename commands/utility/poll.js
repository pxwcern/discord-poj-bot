const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Creates a quick and easy server-wide poll.')
        .addStringOption(option => option.setName('question').setDescription('The question to vote on').setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const embed = new EmbedBuilder()
            .setTitle('📊 Polling Time!')
            .setDescription(`**${question}**\n\nPlease vote using the reactions below.`)
            .setColor('LuminousVividPink')
            .setFooter({ text: `Targeted by ${interaction.user.tag}` });
            
        const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
        await msg.react('✅');
        await msg.react('❌');
    }
};
