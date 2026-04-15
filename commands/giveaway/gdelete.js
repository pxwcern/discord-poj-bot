const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gdelete')
        .setDescription('Deletes a giveaway from the database and deletes the message.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
        .addStringOption(o => o.setName('messageid').setDescription('The ID of the giveaway message').setRequired(true)),
    async execute(interaction) {
        const msgId = interaction.options.getString('messageid');
        const giveaway = db.prepare('SELECT * FROM giveaways WHERE messageId = ?').get(msgId);

        if (!giveaway) return interaction.reply({ content: 'Giveaway not found.', ephemeral: true });

        db.prepare('DELETE FROM giveaways WHERE messageId = ?').run(msgId);
        db.prepare('DELETE FROM giveaway_entries WHERE messageId = ?').run(msgId);

        const channel = interaction.guild.channels.cache.get(giveaway.channelId);
        if (channel) {
            const msg = await channel.messages.fetch(msgId).catch(() => null);
            if (msg) await msg.delete().catch(() => {});
        }

        await interaction.reply({ content: 'Successfully deleted the giveaway.', ephemeral: true });
    }
};
