require('dotenv').config();
const { Client, MessageEmbed } = require('discord.js');
const client = new Client();

const createSpellMsg = require('../api/spells.js').createSpellMsg;

const PREFIX = require('../config').PREFIX;


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
            // case 'combat':
            //     const embed = new MessageEmbed()
            //         .setTitle('Combat Start!')
            //         .setColor(0xff0000)
            //         .setImage(message.author.displayAvatarURL());

            //     message.channel.send(embed);
            //     break;
            case 'help':
                const embed = new MessageEmbed()
                    .setTitle('Command List')
                    .setDescription(
                        'The following are commands you can request from the bot!\n\n' +
                        `The format for commands is: \n${PREFIX} (**command name**) [ ***argument*** ], ...\n\n` +
                        '----------------\n' +
                        'COMMANDS\n' +
                        '----------------'
                    )
                    .addField(
                        `${PREFIX}spell [ _spell name_ ]`,
                        'Provides back spell information to the channel the command was issued'
                    );

                message.channel.send(embed);
                break;

            case 'spell':
                //check if argument is provided
                if(args[0]) {
                    try {
                        const spellmsg = await createSpellMsg(args[0]);
                        message.channel.send(spellmsg);
                    } catch(err) {
                        message.channel.send('Ran out of spell slots, could not get spell :(');
                    }
                } else {
                    message
                        .reply( 'Please provide a spell to look up!\n' +
                                'Need help? Type \'!help\' for list of commands.' );
                }
                break;

            default:
                break;
        }
    }
});

// login discord bot client to discord API gateway
client.login(process.env.DISCORDJS_BOT_TOKEN);