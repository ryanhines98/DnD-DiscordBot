require('dotenv').config();
const { Client, MessageEmbed } = require('discord.js');
const PREFIX = require('../config').PREFIX; // command prefix

// helper functions for bot commands
const { createSpellMsg } = require('./commands/spell');
const { createHelpMsg } = require('./commands/help');


// create bot client
const client = new Client();


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
            .toLowerCase()
            .split(/\s+/);

        switch (CMD_NAME) {
            // displays bot commands for user
            case 'help':
                const helpmsg = createHelpMsg();
                message.channel.send(helpmsg);
                break;

            case 'dm':
                if( message.member.roles.cache.find(role => role.name === 'DM') ) { 
                    message.reply('You are a DM!'); 
                }
                else { 
                    message.reply('Deception check failed, you are no Dungeon Master'); 
                }

                break;

            case 'spell':
                if(args[0]) {
                    try {
                        const spellmsg = await createSpellMsg(args[0]);
                        message.channel.send(spellmsg);
                    } catch(err) {
                        message.channel.send('Ran out of spell slots, could not get spell :(');
                    }
                } else {
                    message.reply( 'Please provide a spell to look up!\n' +
                                   'Need help? Type \'!help\' for command list and their info.' );
                }
                break;

            default:
                break;
        }
    }
});

// login discord bot client to discord API gateway
client.login(process.env.DISCORDJS_BOT_TOKEN);