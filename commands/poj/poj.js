const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poj')
        .setDescription('Manages the POJ (Ghost Ping) system.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Adds a POJ channel and sets removal delay.')
                .addChannelOption(option => 
                    option.setName('channel')
                        .setDescription('Channel where members will be pinged')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText))
                .addIntegerOption(option =>
                    option.setName('seconds')
                        .setDescription('Time in seconds before the message is deleted')
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(60))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Removes a configured POJ channel.')
                .addChannelOption(option => 
                    option.setName('channel')
                        .setDescription('The POJ channel to remove')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Lists all configured POJ channels.')
        ),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;

        if (subcommand === 'set') {
            const channel = interaction.options.getChannel('channel');
            const seconds = interaction.options.getInteger('seconds');

            db.prepare(`
                INSERT INTO poj_channels (guildId, channelId, seconds)
                VALUES (?, ?, ?)
                ON CONFLICT(guildId, channelId) DO UPDATE SET seconds = excluded.seconds
            `).run(guildId, channel.id, seconds);

            await interaction.reply({ 
                content: `Success! New joining members will be pinged in <#${channel.id}> and the message will automatically be deleted after ${seconds} seconds.`, 
                ephemeral: true 
            });
        } 
        else if (subcommand === 'remove') {
            const channel = interaction.options.getChannel('channel');
            
            const result = db.prepare('DELETE FROM poj_channels WHERE guildId = ? AND channelId = ?').run(guildId, channel.id);
            
            if (result.changes > 0) {
                await interaction.reply({ content: `Channel <#${channel.id}> has been successfully removed from the POJ system.`, ephemeral: true });
            } else {
                await interaction.reply({ content: `Channel <#${channel.id}> is not in the POJ list.`, ephemeral: true });
            }
        }
        else if (subcommand === 'list') {
            const rows = db.prepare('SELECT channelId, seconds FROM poj_channels WHERE guildId = ?').all(guildId);
            
            if (!rows || rows.length === 0) {
                return interaction.reply({ content: 'No POJ (Ghost Ping) channels found in this server.', ephemeral: true });
            }

            const list = rows.map((r, index) => `${index + 1}. <#${r.channelId}> - **${r.seconds}** seconds`).join('\n');
            await interaction.reply({ content: `**Current POJ Channels:**\n\n${list}`, ephemeral: true});
        }
    },
};
