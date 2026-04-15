const { SlashCommandBuilder, PermissionFlagsBits, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-transcript')
        .setDescription('Generates a transcript of the current ticket.')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    async execute(interaction) {
        if (!interaction.channel.name.startsWith('support-')) {
            return interaction.reply({ content: 'This command can only be used inside a ticket channel.', ephemeral: true });
        }

        await interaction.deferReply();

        let transcript = '';
        const messages = await interaction.channel.messages.fetch({ limit: 100 });
        
        // Sorting messages by timestamp ascending
        const sortedMessages = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

        sortedMessages.forEach(msg => {
            const timestamp = new Date(msg.createdTimestamp).toLocaleString();
            transcript += `[${timestamp}] ${msg.author.tag}: ${msg.content}\n`;
            if (msg.attachments.size > 0) {
                msg.attachments.forEach(attachment => {
                    transcript += `[ATTACHMENT] ${attachment.url}\n`;
                });
            }
        });

        const buffer = Buffer.from(transcript, 'utf-8');
        const attachment = new AttachmentBuilder(buffer, { name: `transcript-${interaction.channel.name}.txt` });

        await interaction.editReply({ content: 'Here is the transcript for this ticket:', files: [attachment] });
    }
};
