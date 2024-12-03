const { WebhookClient } = require('discord.js');

function styledEmbed(title, description) {
  return {
      title: title,
      description: description,
      color: 0x99150c,
      footer: {
        text: 'Stamp Rally',
        //iconURL: ''
      }
    }
}

module.exports = {
  styledEmbed: styledEmbed
};