const { Client, Collection, IntentsBitField, ApplicationCommandType } = require('discord.js');
const { MongoClient } = require('mongodb');
const fs = require('fs');

const client = new Client({
  intents: [],
  partials: ['MESSAGE', 'CHANNEL']
});

const auth = require('./auth.json');

client.once('ready', async () => {
  client.user.setActivity("Ho Ho Ho!");
  
  client.mongo = new MongoClient(auth.mongodb).db();
  
  // Register commands
  client.commands = new Collection();
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    
    // Register application slash commands
    client.application.commands.create({
      name: command.name,
      description: command.description,
      options: command.options,
      type: command.type || ApplicationCommandType.ChatInput,
      defaultPermission: true,
    });
  }
  
  // Register event handlers
  client.events = new Collection();
  const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
  
  for (const file of eventFiles) {
    const eventLogic = require(`./events/${file}`);
    client.on(eventLogic.name, (...eventArgs) => eventLogic.execute(client, eventArgs));
  }
 
  console.log(`Logged in as ${client.user.tag} @ ${new Date().toLocaleString()}!`);
});

client.login(auth.discord);