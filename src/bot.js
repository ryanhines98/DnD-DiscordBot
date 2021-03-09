require('dotenv').config();
const { Client, MessageEmbed, MessageAttachment } = require('discord.js');
const client = new Client();

const getSpellInfo = require('../api/requests.js').getSpellInfo;


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
            // case 'combat':
            //     const embed = new MessageEmbed()
            //         .setTitle('Combat Start!')
            //         .setColor(0xff0000)
            //         .setImage(message.author.displayAvatarURL());

            //     message.channel.send(embed);
            //     break;

            case 'spell':
                if(args[0]) {
                    try {
                        // make call to API
                        const spell = await getSpellInfo(args[0]);
                        // create message
                        const embed = new MessageEmbed();

                        // set attributes for information
                        embed.setTitle(`${spell.name}    |   Spell Lvl: ${spell.level}`)
                            .setDescription(spell.desc)
                            .addField('School', spell.school.name, true)
                            .addField('Components', `${spell.components}`, true);

                        if(spell.material) embed.addField('Material', spell.material, true);

                        embed.addField('\u200B', '\u200B'); // block of space

                        embed.addFields(
                                { name: 'Casting Time', value: spell.casting_time, inline: true },
                                { name: 'Duration', value: spell.duration, inline: true },
                                { name: 'Range', value: spell.range, inline: true },
                                { name: 'Concentration', value: spell.concentration, inline: true },
                                { name: 'Ritual', value: spell.ritual, inline: true },
                            );
                        (spell.damage) ? 
                            embed.addField('Dmg Type', spell.damage.damage_type.name, true) :
                            embed.addField('\u200B', '\u200B', true);

                        if(spell.higher_level) {
                            embed.addField('\u200B', '\u200B');
                            embed.setFooter(`Higher levels: ${spell.higher_level}`);
                        }
                        
                        // attaching local image to message for thumbnail
                        const attachment = new MessageAttachment(`./src/images/${spell.school.index}.png`, `${spell.school.index}.png`);
                        embed.attachFiles(attachment)
                            .setThumbnail(`attachment://${spell.school.index}.png`);
                        
                        // send back to original channel command was issued
                        message.channel.send(embed);

                    } catch(err) {
                        console.log(err);
                        message.channel.send('Sorry, could not get spell :(');
                    }
                } else {
                    message.reply('Please provide a spell to look up!');
                }
                
                break;

            default:
                break;
        }
    }
});

// login discord bot client to discord API gateway
client.login(process.env.DISCORDJS_BOT_TOKEN);