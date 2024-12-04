const { ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const fs = require('fs');

const STEPS = { value: 8, name: 'The First Steps' }
const TRIBE = { value: 4, name: 'Tribe' }
const VIMAA = { value: 2, name: 'Vivaa Vimaa' }
const RAIDERS = { value: 1, name: "The Raider's Retreat" }

const stampers = {
  '53547160494407680': TRIBE,
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