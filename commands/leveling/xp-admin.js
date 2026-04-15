const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xp-admin')
        .setDescription('Manage user XP and Levels.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(sub => sub.setName('add').setDescription('Add XP to a user.')
            .addUserOption(o => o.setName('user').setDescription('The user').setRequired(true))
            .addIntegerOption(o => o.setName('amount').setDescription('Amount of XP').setRequired(true)))
        .addSubcommand(sub => sub.setName('set').setDescription('Set a user\'s XP.')
            .addUserOption(o => o.setName('user').setDescription('The user').setRequired(true))
            .addIntegerOption(o => o.setName('amount').setDescription('Target XP').setRequired(true)))
        .addSubcommand(sub => sub.setName('reset').setDescription('Reset a user\'s XP.')
            .addUserOption(o => o.setName('user').setDescription('The user').setRequired(true))),
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        let lvlRow = db.prepare('SELECT * FROM users_level WHERE guildId = ? AND userId = ?').get(interaction.guild.id, user.id);
        if (!lvlRow) {
            db.prepare('INSERT INTO users_level (guildId, userId, xp, level) VALUES (?, ?, ?, ?)').run(interaction.guild.id, user.id, 0, 0);
            lvlRow = { xp: 0, level: 0 };
        }

        if (sub === 'add') {
            const newXp = lvlRow.xp + amount;
            const newLevel = Math.floor(newXp / 300);
            db.prepare('UPDATE users_level SET xp = ?, level = ? WHERE guildId = ? AND userId = ?').run(newXp, newLevel, interaction.guild.id, user.id);
            await interaction.reply({ content: `Added **${amount} XP** to ${user.tag}. They are now Level **${newLevel}**.`, ephemeral: true });
        } else if (sub === 'set') {
            const newLevel = Math.floor(amount / 300);
            db.prepare('UPDATE users_level SET xp = ?, level = ? WHERE guildId = ? AND userId = ?').run(amount, newLevel, interaction.guild.id, user.id);
            await interaction.reply({ content: `Set ${user.tag}'s XP to **${amount}**. They are now Level **${newLevel}**.`, ephemeral: true });
        } else if (sub === 'reset') {
            db.prepare('UPDATE users_level SET xp = 0, level = 0 WHERE guildId = ? AND userId = ?').run(interaction.guild.id, user.id);
            await interaction.reply({ content: `Reset XP for ${user.tag}.`, ephemeral: true });
        }
    },
};
