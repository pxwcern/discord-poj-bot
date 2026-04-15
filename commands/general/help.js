const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Advanced help menu (All professional categories).'),
    async execute(interaction) {
        
        // ---------------- MODERATION MENU ----------------
        const modEmbed = new EmbedBuilder()
            .setTitle('🛡️ 🛑 ADVANCED MODERATION 🛑 🛡️')
            .setColor('Red')
            .setDescription(`
# ⚔️ Essential Tools
> **\`/ban <user>\`** ☠️ Banishes them to space!
> **\`/kick <user>\`** 👢 Gives them the boot!
> **\`/clear <amount>\`** 🧹 Sweeps the messages away!
> **\`/set-log <channel>\`** 📜 Sets the observer log!

# ⏱️ Restrictions
> **\`/timeout <user> <mins>\`** ⏳ Sends them to the quiet corner!
> **\`/untimeout <user>\`** 🕊️ Forgives their sins!
> **\`/slowmode <sec>\`** 🐢 Drops to turtle speed!
> **\`/lock\`** & **\`/unlock\`** 🔒 Barricades and opens the channel!

# ⚠️ Warnings (100+ Auto!)
> **\`/warn <user>\`**, **\`/warnings <user>\`**, **\`/clear-warnings <user>\`**
> Also **100+ Rapid Moderation** prefix commands!
> *Try:* \`b!rule1\`, \`b!warn-spam\`, \`b!quick-timeout-10m\` etc.
            `);
            
        // ---------------- PRO SYSTEMS ----------------
        const proEmbed = new EmbedBuilder()
            .setTitle('💎 PROFESSIONAL SYSTEMS 💎')
            .setColor('Gold')
            .setDescription(`
# 💰 Economy & Finance
> **\`/daily\`** 🎁 Claim your daily huge payload!
> **\`/work\`** 💼 Work every 10 mins!
> **\`/balance\`** 🏦 Check your wallet!
> **\`/pay <user> <amount>\`** 💸 Transfer money!

# ⭐ XP & Leveling
> Earn XP automatically and rank up through chatting!
> **\`/rank\`** 🏆 View your (or another's) stats!
> **\`/leaderboard\`** 👑 Top 10 Leaderboard!

# 🎫 Utility / Games / Giveaway
> **\`/ticket-setup\`** / **\`/ticket-close\`** 📩 Open support modules!
> **\`/gstart\`** 🎁 Start an advanced giveaway!
> **\`/poll\`** 📊 Create a public poll!
> **\`/afk <reason>\`** 💤 Sends you to sleep mode!
> **\`/serverinfo\`** / **\`/userinfo\`** 📋 Detailed stat profiles!
            `);
            
        // ---------------- POJ MENU ----------------
        const pojEmbed = new EmbedBuilder()
            .setTitle('👻 ✨ GHOST PING (POJ) SYSTEM ✨ 👻')
            .setColor('Purple')
            .setDescription(`
# 🎭 What is POJ?
Our advanced queueing engine tags incoming members in batches and immediately deletes the messages! Zero spam!

# 🚀 Commands
> **\`/poj set <channel> <sec>\`** 🎯 Lock a scheduled POJ!
> **\`/poj remove <channel>\`** 🗑️ Delete it!
> **\`/poj list\`** 📃 Check where POJ is active!
            `);
            
        // ---------------- FUN MENU ----------------
        const funEmbed = new EmbedBuilder()
            .setTitle('🎮 🌈 UNLIMITED ENTERTAINMENT 🌈 🎮')
            .setColor('Green')
            .setDescription(`
# 🕹️ Games
> **\`b!rps\`** ✊✋✌️ Challenge me!
> **\`b!roll\`** 🎲 Roll the dice!
> **\`b!coinflip\`** 🪙 Heads or Tails!
> **\`b!8ball2\`** 🎱 Ask the magic sphere!

# 🤹 Social
> **\`b!lovecalc\`** 💘 Love meter!
> **\`b!joke\`** 🤡 Comedy hub!
> **\`b!avatar\`** 📸 Steal avatars!
> **\`b!ping\`** 🏓 Speedtest!

# 🤖 And much more...
> We have generated **500+ Functional Prefix Commands**!
> Type \`/about\` to view my developer status!
            `);

        // Buttons
        const btnMod = new ButtonBuilder().setCustomId('help_mod').setLabel('Moderator').setStyle(4).setEmoji('🛡️');
        const btnPro = new ButtonBuilder().setCustomId('help_pro').setLabel('Professional').setStyle(2).setEmoji('💎');
        const btnPoj = new ButtonBuilder().setCustomId('help_poj').setLabel('Ghost P.').setStyle(1).setEmoji('👻');
        const btnFun = new ButtonBuilder().setCustomId('help_fun').setLabel('Entertainment').setStyle(3).setEmoji('🎮');

        const row = new ActionRowBuilder().addComponents(btnMod, btnPro, btnPoj, btnFun);

        const response = await interaction.reply({ 
            embeds: [modEmbed], 
            components: [row] 
        });

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: '🚫 Only the command author can use these buttons!', ephemeral: true });
            }

            if (i.customId === 'help_mod') await i.update({ embeds: [modEmbed] });
            else if (i.customId === 'help_pro') await i.update({ embeds: [proEmbed] });
            else if (i.customId === 'help_poj') await i.update({ embeds: [pojEmbed] });
            else if (i.customId === 'help_fun') await i.update({ embeds: [funEmbed] });
        });

        collector.on('end', () => {
            row.components.forEach(c => c.setDisabled(true));
            interaction.editReply({ components: [row] }).catch(() => {});
        });
    },
};
