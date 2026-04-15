const { Events } = require('discord.js');
const db = require('../db');

// Map to hold queues for each guild and channel
// Structure: { "guildId-channelId": { members: [], timer: null } }
const pojQueues = new Map();

async function sendPojBatch(channel, memberIds, deleteSeconds) {
    if (memberIds.length === 0) return;
    
    // Join up to 5 members with a comma
    const content = memberIds.map(id => `<@${id}>`).join(', ');
    
    try {
        const msg = await channel.send({ content });
        setTimeout(() => {
            msg.delete().catch(err => console.error("Error deleting message:", err));
        }, deleteSeconds * 1000);
    } catch (err) {
        console.error(`Error sending POJ batch message (${channel.id}):`, err);
    }
}

async function sendWelcomeMessage(member) {
    const guild = member.guild;

    // Fetch the welcome channel ID from the database
    const row = db.prepare('SELECT channelId FROM welcome_channels WHERE guildId = ?').get(guild.id);
    if (!row) return; // No welcome channel set for this server

    const welcomeChannel = guild.channels.cache.get(row.channelId);
    if (!welcomeChannel || !welcomeChannel.isTextBased()) return;

    // Fetch invites to determine the inviter
    const invites = await guild.invites.fetch();
    const inviter = invites.find(invite => invite.uses > 0 && invite.inviter);

    const inviterName = inviter?.inviter?.username || 'Unknown';
    const inviterInviteCount = inviter?.uses || 0;

    const welcomeMessage = `<:plus:1491822353825665265> Welcome to **${guild.name}** dear ${member.user.username}.
<:plus:1491822353825665265> **${guild.name}** now has **${guild.memberCount}** members.
<:plus:1491822353825665265> Invited by **${inviterName}**, who now has **${inviterInviteCount}** invites.`;

    try {
        await welcomeChannel.send(welcomeMessage);
    } catch (error) {
        console.error('Error sending welcome message:', error);
    }
}

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member, client) {
        const pojRows = db.prepare('SELECT * FROM poj_channels WHERE guildId = ?').all(member.guild.id);
        
        if (!pojRows || pojRows.length === 0) return;

        for (const row of pojRows) {
            const channel = member.guild.channels.cache.get(row.channelId);
            if (!channel || !channel.isTextBased()) continue;

            const guildId = member.guild.id;
            const channelId = channel.id;
            const queueKey = `${guildId}-${channelId}`;
            const deleteSeconds = row.seconds || 2;

            // Initialize queue for this channel if not exists
            if (!pojQueues.has(queueKey)) {
                pojQueues.set(queueKey, {
                    members: [],
                    timer: null
                });
            }

            const queueData = pojQueues.get(queueKey);
            
            // Add member to the queue
            queueData.members.push(member.id);

            // If we have 5 members in queue, send instantly to respect max 5 limit
            if (queueData.members.length >= 5) {
                if (queueData.timer) {
                    clearTimeout(queueData.timer);
                    queueData.timer = null;
                }
                
                // Get exactly 5 members
                const batch = queueData.members.splice(0, 5);
                sendPojBatch(channel, batch, deleteSeconds);
            } 
            // Otherwise, start a 3-second timer to batch whoever joins
            else if (!queueData.timer) {
                queueData.timer = setTimeout(() => {
                    const currentQueue = pojQueues.get(queueKey);
                    if (currentQueue && currentQueue.members.length > 0) {
                        // Take up to 5 members out (if somehow more snuck in)
                        const batch = currentQueue.members.splice(0, 5);
                        sendPojBatch(channel, batch, deleteSeconds);
                    }
                    currentQueue.timer = null;
                }, 3000); // 3 seconds window
            }
        }

        // Send the custom welcome message
        sendWelcomeMessage(member);
    },
};
