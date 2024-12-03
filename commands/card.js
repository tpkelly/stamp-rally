const { ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const common = require('../common.js');
const fs = require('fs');

module.exports = {
  name: 'card',
  description: 'Show the stamp card, for yourself or someone else',
  options: [
    { type: ApplicationCommandOptionType.User, name: "user", description: "Whose card to display. Default is yourself", required: false },
  ],
  executeInteraction: async(interaction) => {
    var user = interaction.options.getUser('user') ?? interaction.user;
    
    // TODO: Actually work out which stamps they have
    var stampNum = Math.floor(Math.random() * 16)

    fs.readFile(`./assets/${stampNum}.png`, function read(err, data) {
      if (err) { throw err; }
      
      var builder = new AttachmentBuilder(data);
      builder.setName('card.png');
      
      interaction.editReply({ content: `Here is the stamp book for <@${user.id}>!`, files: [builder.attachment] });
    });
  }
};