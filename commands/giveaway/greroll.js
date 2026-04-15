const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('greroll')
        .setDescription('Rerolls a giveaway to select new winners.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
        .addStringOption(o => o.setName('messageid').setDescription('The ID of the giveaway message').setRequired(true)),
    async execute(interaction) {
        const msgId = interaction.options.getString('messageid');
        const giveaway = db.prepare('SELECT * FROM giveaways WHERE messageId = ?').get(msgId);

        if (!giveaway) return interaction.reply({ content: 'Giveaway not found.', ephemeral: true });
        if (giveaway.status !== 'ended') return interaction.reply({ content: 'Giveaway has not ended yet.', ephemeral: true });

        const channel = interaction.guild.channels.cache.get(giveaway.channelId);
        if (!channel) return interaction.reply({ content: 'Channel not found.', ephemeral: true });

        const msg = await channel.messages.fetch(msgId).catch(() => null);
        if (!msg) return interaction.reply({ content: 'Giveaway message not found.', ephemeral: true });

        const entries = db.prepare('SELECT userId FROM giveaway_entries WHERE messageId = ?').all(msgId);

        if (entries.length === 0) return interaction.reply({ content: 'No entries found for this giveaway.', ephemeral: true });

        const winners = [];
        const validUsers = entries.map(e => e.userId);
        
        for (let i = 0; i < giveaway.winnersCount; i++) {
            if (validUsers.length === 0) break;
            const winnerIndex = Math.floor(Math.random() * validUsers.length);
            winners.push(`<@${validUsers[winnerIndex]}>`);
            validUsers.splice(winnerIndex, 1);
        }

        await interaction.reply({ content: `**New Giveaway Reroll!**\n🎊 Congratulations ${winners.join(', ')}!\n\nYou won the **${giveaway.prize}**!`, ephemeral: false });
    }
};
