const { channel } = require('diagnostics_channel');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
const https = require('https');

let keys = JSON.parse(fs.readFileSync('keys.json'));
let botToken = keys.botToken;
const prefix = '!';

const options = {
    hostname: 'dog.ceo',
    port: 443,
    path: '/api/breeds/image/random',
    method: 'GET'
};

client.once('ready', () => {
    console.log("getPicureBot is online")
});

client.on('messageCreate', (message) => {
    if(message.author.bot) return;

    const args = message.content.slice(prefix.length).split("/ +/");
    const command = args.shift().toLowerCase();

    if(command === 'dog')
    {
        message.channel.send("Here's a dog picture");

        const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`);
          
            res.on('data', d => {
              //console.log(JSON.parse(d));
              message.channel.send(JSON.parse(d).message);
            });
          });
          
          req.on('error', error => {
            console.error(error);
          });
          
          req.end();
    }
});

client.login(botToken);
