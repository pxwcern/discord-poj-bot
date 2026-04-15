const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Deletes a specified amount of messages in the channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Amount of messages to delete (1-100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        try {
            const deletedMessages = await interaction.channel.bulkDelete(amount, true);
            await interaction.reply({ content: `Successfully deleted **${deletedMessages.size}** messages.`, ephemeral: true });
            
            const logRow = db.prepare('SELECT channelId FROM mod_logs WHERE guildId = ?').get(interaction.guild.id);
            if (logRow) {
                const logChannel = interaction.guild.channels.cache.get(logRow.channelId);
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setTitle('Messages Deleted')
                        .setColor('Yellow')
                        .addFields(
                            { name: 'Channel', value: `<#${interaction.channel.id}>` },
                            { name: 'Moderator', value: `${interaction.user.tag}` },
                            { name: 'Amount', value: `${deletedMessages.size}` }
                        )
                        .setTimestamp();
                    logChannel.send({ embeds: [embed] }).catch(() => {});
                }
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while deleting messages. I cannot delete messages older than 14 days.', ephemeral: true });
        }
    },
};
