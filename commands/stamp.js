const { ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const fs = require('fs');

const VENUE_ONE = 8
const VENUE_TWO = 4
const VENUE_THREE = 2
const VENUE_FOUR = 1

const stampers = {
  '189456522630266880': { value: VENUE_ONE, name: 'Venue One' },
  '181499334855098379': { value: VENUE_TWO, name: 'Venue Two' },
  '855131514593083412': { value: VENUE_THREE, name: 'Venue Three' }
}

module.exports = {
  name: 'stamp',
  description: 'Stamp a card for a roleplayer',
  options: [
    { type: ApplicationCommandOptionType.User, name: "user", description: "Whose card to stamp", required: true },
  ],
  executeInteraction: async(interaction) => {
    var user = interaction.options.getUser('user');
    var stamper = interaction.user;
    
    if (!stampers[stamper.id]) {
      interaction.editReply({ content: "Sorry, you are not one of the registered stampers! Be sure to visit venues and collect stamps" });
      return;
    }
    
    var stamperValue = stampers[stamper.id];
    
    var doc = await interaction.client.mongo.collection('stamps').findOne({ _id: user.id });
    if (!doc) {
      await interaction.client.mongo.collection('stamps').insertOne({ _id: user.id, value: stamperValue.value, name: user.tag });
    } else {
      await interaction.client.mongo.collection('stamps').findOneAndUpdate({ _id: user.id }, { $set: { value: doc.value | stamperValue.value }});
    }

    interaction.editReply({ content: `<@${user.id}> just earned a new stamp from ${stamperValue.name}!` });
  }
};