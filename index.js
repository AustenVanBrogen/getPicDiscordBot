const { channel } = require('diagnostics_channel');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
const https = require('https');
const { promisify } = require('util');
require("dotenv").config();

//let keys = JSON.parse(fs.readFileSync('keys.json'));
//let botToken = keys.botToken;
botToken = process.env.BOT_TOKEN;
const prefix = '!';

function showPicture(pictureJSON)
{
  console.log(pictureJSON.message);
}

function buildOptions(hostnameVar, pathVar)
{
  let options = {
    hostname: hostnameVar,
    port: 443,
    path: pathVar,
    method: 'GET'
  };
  return options;
}

function getPicture(message, command, options)
{
  let response;
  return new Promise(function (resolve, reject){
    const req = https.request(options, res => {
      console.log(`statusCode: ${res.statusCode}`);
    
      res.on('data', d => {
        // message.channel.send(`Here's a ${command} picture`);
        // message.channel.send(JSON.parse(d).message);
        response = JSON.parse(d);
        //console.log(JSON.parse(d));
        resolve(response);
      });
    });
    
    req.on('error', error => {
      console.error(error);
      reject(error);
    });
    
    req.end();
  });
}

function showCatPicture(message, response)
{
  try{
    let catJSON = JSON.parse(JSON.stringify(response));
    //console.log(catJSON.url);
    //console.log(catJSON);
    message.channel.send(catJSON[0].url);
  }
  catch(error){
    console.log(error);
    message.channel.send('https://cdn2.thecatapi.com/images/MTU1ODY2MA.jpg');
  }
}

client.once('ready', () => {
    console.log("getPicureBot is online")
});

client.on('messageCreate', async (message) => {
    if(message.author.bot) return;

    const args = message.content.slice(prefix.length).split("/ +/");
    const command = args.shift().toLowerCase();
    let hostname;
    let path;

    if(command === 'dog')
    {
      hostname = 'dog.ceo';
      path = '/api/breeds/image/random';
      getPicture(message, command, buildOptions(hostname, path))
      .then(response => message.channel.send(response.message))
      .catch(error => console.log(error));

      // message.channel.send("Here's a dog picture");
      // message.channel.send(JSON.parse(response).message);
    }
    else if(command === 'cat')
    {
      hostname = 'api.thecatapi.com';
      path = '/v1/images/search';
      //console.log(hostname + path);
      getPicture(message, command, buildOptions(hostname, path))
      .then(response => showCatPicture(message, response))
      .catch(error => console.log(error));
    }
});

client.login(botToken);
