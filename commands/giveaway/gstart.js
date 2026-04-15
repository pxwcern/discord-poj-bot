const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gstart')
        .setDescription('Starts a new persistent giveaway with buttons.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
        .addStringOption(o => o.setName('duration').setDescription('Duration (e.g. 10m, 1h, 1d)').setRequired(true))
        .addIntegerOption(o => o.setName('winners').setDescription('Amount of winners').setRequired(true))
        .addStringOption(o => o.setName('prize').setDescription('Prize of the giveaway').setRequired(true)),
    async execute(interaction) {
        const timeStr = interaction.options.getString('duration');
        const winnersCount = interaction.options.getInteger('winners');
        const prize = interaction.options.getString('prize');

        let ms = 0;
        const timeMatch = timeStr.match(/^(\d+)([smhd])$/);
        if (!timeMatch) return interaction.reply({ content: "Invalid time format! Use: 10s, 5m, 2h, 1d.", ephemeral: true });
        
        const val = parseInt(timeMatch[1]);
        const unit = timeMatch[2];
        if (unit === 's') ms = val * 1000;
        else if (unit === 'm') ms = val * 60000;
        else if (unit === 'h') ms = val * 3600000;
        else if (unit === 'd') ms = val * 86400000;

        const endTime = Date.now() + ms;

        const embed = new EmbedBuilder()
            .setTitle('🎁 GIVEAWAY STARTING! 🎁')
            .setDescription(`**Prize:** ${prize}\n**Winners:** ${winnersCount}\n**Hosted By:** ${interaction.user}\n\n**Ends:** <t:${Math.floor(endTime / 1000)}:R>`)
            .setColor('Gold')
            .setTimestamp(endTime);

        const btn = new ButtonBuilder()
            .setCustomId('g_join')
            .setLabel('Join Giveaway')
            .setEmoji('🎉')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(btn);

        const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

        db.prepare('INSERT INTO giveaways (messageId, guildId, channelId, prize, winnersCount, endTime, hostedBy) VALUES (?, ?, ?, ?, ?, ?, ?)')
            .run(msg.id, interaction.guildId, interaction.channelId, prize, winnersCount, endTime, interaction.user.id);
    }
};
