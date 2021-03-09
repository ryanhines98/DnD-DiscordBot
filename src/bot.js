require('dotenv').config();
const { Client, MessageEmbed } = require('discord.js');
const client = new Client();

const getMonster = require('../api/requests.js');


// prefix in messages to identify a bot command
const PREFIX = "!";

// event when bot is logged in and ready for use
client.on('ready', () => {
    console.log(`${client.user.tag} has logged in`);
});

// logic on discord message
client.on('message', async (message) => {
    // if message is from bot, return
    if(message.author.bot) return;

    // logic for commands
    if(message.content.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = message.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);

        switch (CMD_NAME) {
            case 'combat':
                const embed = new MessageEmbed()
                    .setTitle('Combat Start!')
                    .setColor(0xff0000)
                    .setImage(message.author.displayAvatarURL());

                message.channel.send(embed);
                break;

            case 'monster':
                if(args[0]) {
                    const monster = await getMonster(args[0]);
                    const embed = new MessageEmbed()
                        .setTitle(monster.name)
                        .addField('AC', monster.armor_class, true);
                    
                    message.channel.send(embed);
                } else {
                    message.channel.send('Please provide a monster to look up!');
                }
                
                break;

            default:
                break;
        }
    }
});

// login discord bot client to discord API gateway
client.login(process.env.DISCORDJS_BOT_TOKEN);