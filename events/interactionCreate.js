const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (interaction.isButton()) {
            if (interaction.customId === 'ticket_open') {
                const channelName = `support-${interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
                
                const existingChannel = interaction.guild.channels.cache.find(c => c.name === channelName);
                if (existingChannel) {
                    return interaction.reply({ content: `You already have an active support ticket: ${existingChannel}`, ephemeral: true });
                }

                try {
                    const ticketChannel = await interaction.guild.channels.create({
                        name: channelName,
                        type: 0, // GuildText
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: ['ViewChannel'],
                            },
                            {
                                id: interaction.user.id,
                                allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
                            }
                        ]
                    });

                    await interaction.reply({ content: `Your support ticket has been created: ${ticketChannel}`, ephemeral: true });
                    await ticketChannel.send({ content: `Hello ${interaction.user}! Support staff will be with you shortly. Please describe your issue here.\n\nMods can type \`/ticket-close\` to delete this channel.` });

                } catch (e) {
                    console.error("Ticket creation failed", e);
                    await interaction.reply({ content: "Failed to create channel. Please ensure I have 'Manage Channels' permission.", ephemeral: true });
                }
            }

            if (interaction.customId === 'g_join') {
                const db = require('../db');
                const giveaway = db.prepare('SELECT * FROM giveaways WHERE messageId = ? AND status = ?').get(interaction.message.id, 'active');
                if (!giveaway) return interaction.reply({ content: 'This giveaway has ended!', ephemeral: true });

                try {
                    db.prepare('INSERT INTO giveaway_entries (messageId, userId) VALUES (?, ?)').run(interaction.message.id, interaction.user.id);
                    await interaction.reply({ content: '🎉 You have successfully joined the giveaway!', ephemeral: true });
                } catch (e) {
                    await interaction.reply({ content: 'You are already in this giveaway!', ephemeral: true });
                }
            }
            return;
        }

        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'An internal error occurred while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'An internal error occurred while executing this command!', ephemeral: true });
            }
        }
    },
};
