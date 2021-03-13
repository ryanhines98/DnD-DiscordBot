const { MessageEmbed } = require('discord.js');
const PREFIX = require('../../config').PREFIX;

exports.createHelpMsg = function() {
    const embed = new MessageEmbed()
        .setTitle('Command List')
        .setDescription(
            'The following are commands you can request from the bot!\n\n' +
            `The format for commands follows: \n${PREFIX} (**command name**) [ ***argument*** ], ...\n\n` +
            'If an argument name has a space within it, instead replace spaces with a dash (-)\n\n' +
            '----------------\n' +
            'COMMANDS\n' +
            '----------------'
        )
        .addField(
            `${PREFIX}spell [ _spell name_ ]`,
            'Provides back spell information to the channel the command was issued. (ex: !spell magic-missile)'
        );
    return embed;
}
