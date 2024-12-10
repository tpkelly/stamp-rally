const { ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const fs = require('fs');

const STEPS = { value: 8, name: 'The First Steps' }
const TRIBE = { value: 4, name: 'Tribe' }
const VIMAA = { value: 2, name: 'Vivaa Vimaa' }
const RAIDERS = { value: 1, name: "The Raider's Retreat" }
const FLEX = {}

const stampers = {
  '287948876244320256': VIMAA, // Escher
  '53547160494407680': TRIBE, // Phoe
  '855131514593083412': RAIDERS, // Kayla
  '274223399872626689': STEPS, // Akiko
  '99593441855438848': STEPS, // Cynthia
  '355666055760183317': STEPS, // Mis'to
  '189456522630266880': FLEX, // Koi
  '272402154982080512': FLEX, // Hoth
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
    
    var stamperValue = stampers[stamper.id];
    if (stamperValue === FLEX) {
      var date = new Date(Date.now() - 12*60*60*1000)
      switch(date.getDay()) {
        case 1: stamperValue = STEPS;
          break;
        case 4: stamperValue = TRIBE;
          break;
        case 5: stamperValue = VIMAA;
          break;
        case 6: stamperValue = RAIDERS;
          break;
        default: stamperValue = undefined;
      }
    }
    
    if (!stamperValue) {
      interaction.editReply({ content: "Sorry, you are not one of the registered stampers! Be sure to visit venues and collect stamps" });
      return;
    }
    
    var doc = await interaction.client.mongo.collection('stamps').findOne({ _id: user.id });
    if (!doc) {
      await interaction.client.mongo.collection('stamps').insertOne({ _id: user.id, value: stamperValue.value, name: user.tag });
    } else {
      await interaction.client.mongo.collection('stamps').findOneAndUpdate({ _id: user.id }, { $set: { value: doc.value | stamperValue.value }});
    }

    interaction.editReply({ content: `<@${user.id}> just earned a new stamp from ${stamperValue.name}!` });
  }
};
