module.exports = {
    name: 'rps',
    execute(message, args, client) {
        const choices = ['rock', 'paper', 'scissors'];
        const userChoice = args[0]?.toLowerCase();
        
        if (!choices.includes(userChoice)) {
            return message.channel.send('Please choose: `rock`, `paper`, or `scissors`. (e.g. b!rps rock)');
        }
        
        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        let result = '';
        
        if (userChoice === botChoice) result = "It's a tie!";
        else if (
            (userChoice === 'rock' && botChoice === 'scissors') ||
            (userChoice === 'paper' && botChoice === 'rock') ||
            (userChoice === 'scissors' && botChoice === 'paper')
        ) result = "You win! 🎉";
        else result = "I win! 😈";
        
        message.channel.send(`I chose **${botChoice}**. ${result}`);
    }
};
