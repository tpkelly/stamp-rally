const { ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'raffle',
  guildCommand: true,
  description: 'Show the list of people with full stamp cards',
  options: [],
  executeInteraction: async(interaction) => {
    var doc = await interaction.client.mongo.collection('stamps').find({ value: 15 });
    if (doc) {
      var entrants = await doc.toArray()
      var entrantsNamed = entrants.map(x => `${x.name} (${x._id})`)
      interaction.editReply({ content: `Raffle entrants:\n${entrantsNamed.join("\n")}` });
    }
  }
};