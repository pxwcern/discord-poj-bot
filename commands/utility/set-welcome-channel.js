const { SlashCommandBuilder } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcomer')
        .setDescription('Manage the welcome channel for this server')
        .addSubcommand(subcommand => 
            subcommand.setName('set')
                .setDescription('Set the welcome channel for this server')
                .addChannelOption(option => 
                    option.setName('channel')
                        .setDescription('The channel to set as the welcome channel')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand => 
            subcommand.setName('remove')
                .setDescription('Remove the welcome channel for this server')
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'set') {
            const channel = interaction.options.getChannel('channel');

            if (!channel.isTextBased()) {
                return interaction.reply({ content: 'Please select a text-based channel.', ephemeral: true });
            }

            try {
                db.prepare(`INSERT INTO welcome_channels (guildId, channelId) VALUES (?, ?) 
                            ON CONFLICT(guildId) DO UPDATE SET channelId = excluded.channelId`)
                  .run(interaction.guild.id, channel.id);

                return interaction.reply({ content: `Welcome channel has been set to ${channel}.`, ephemeral: true });
            } catch (error) {
                console.error('Error setting welcome channel:', error);
                return interaction.reply({ content: 'There was an error setting the welcome channel.', ephemeral: true });
            }
        } else if (subcommand === 'remove') {
            try {
                db.prepare('DELETE FROM welcome_channels WHERE guildId = ?').run(interaction.guild.id);
                return interaction.reply({ content: 'Welcome channel has been removed.', ephemeral: true });
            } catch (error) {
                console.error('Error removing welcome channel:', error);
                return interaction.reply({ content: 'There was an error removing the welcome channel.', ephemeral: true });
            }
        }
    },
};