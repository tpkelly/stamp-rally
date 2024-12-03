const { ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'card',
  description: 'Show the stamp card, for yourself or someone else',
  options: [
    { type: ApplicationCommandOptionType.User, name: "user", description: "Whose card to display. Default is yourself", required: false },
  ],
  executeInteraction: async(interaction) => {
    var user = interaction.options.getUser('user') ?? interaction.user;
    
    var stampNum = 0
    
    var doc = await interaction.client.mongo.collection('stamps').findOne({ _id: user.id });
    if (doc) {
      stampNum = doc.value
    }

    fs.readFile(`./assets/${stampNum}.png`, function read(err, data) {
      if (err) { throw err; }
      
      var builder = new AttachmentBuilder(data);
      builder.setName('card.png');
      
      interaction.editReply({ content: `Here is the stamp book for <@${user.id}>!`, files: [builder.attachment] });
    });
  }
};