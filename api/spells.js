const axios = require('axios');
const BASE_URL = require('../config').API_URL;
const COLOR = require('../config').PRIMARY_COLOR;
const SCHOOL_COLORS = require('../config').COLORS_SCHOOLS;
const { MessageEmbed, MessageAttachment } = require('discord.js');


// calls D&D API for requested spell information
function getSpell(spell) {
    const data = axios
        .get(`${BASE_URL}spells/${spell}`)
        .then(res => res.data)
        .catch(err => { throw err.response.data });

    return data;
}

// using information obtained from API
// construct and return discord message
// displaying spell information
exports.createSpellMsg = async function(arg) {
    try {
        // get spell information
        const spell = await getSpell(arg);
        // create message
        const embed = new MessageEmbed();

        // set message title
        if(spell.level === 0) embed.setTitle(`${spell.name}    |   Spell Lvl: Cantrip`);
        else embed.setTitle(`${spell.name}    |   Spell Lvl: ${spell.level}`);

        // set first information block
        embed.setDescription(spell.desc)
            .addField('School', spell.school.name, true)
            .addField('Components', `${spell.components}`, true);
        if(spell.material) embed.addField('Material', spell.material, true);

        embed.addField('\u200B', '\u200B'); // block of space

        // set second information block
        embed.addFields(
                { name: 'Casting Time', value: spell.casting_time, inline: true },
                { name: 'Duration', value: spell.duration, inline: true },
                { name: 'Range', value: spell.range, inline: true },
                { name: 'Concentrate', value: spell.concentration, inline: true },
                { name: 'Ritual', value: spell.ritual, inline: true },
            );
        (spell.damage) ? 
            embed.addField('Dmg Type', spell.damage.damage_type.name, true) :
            embed.addField('\u200B', '\u200B', true);

        // set footer for higher level spell information
        if(spell.higher_level) {
            embed.addField('\u200B', '\u200B');
            embed.setFooter(`Higher Levels: ${spell.higher_level}`);
        }
        
        // attaching local image to message for thumbnail
        const attachment = new MessageAttachment(`./src/images/${spell.school.index}.png`, `${spell.school.index}.png`);
        embed.attachFiles(attachment)
            .setThumbnail(`attachment://${spell.school.index}.png`);

        // set color scheme based on spell school
        embed.setColor(SCHOOL_COLORS[spell.school.index])

        return embed;

    } catch(err) {
        console.log("--- ERROR: SPELL MSG CONSTRUCTION ---");
        if(err) console.log(err);
        throw err;
    }
}
