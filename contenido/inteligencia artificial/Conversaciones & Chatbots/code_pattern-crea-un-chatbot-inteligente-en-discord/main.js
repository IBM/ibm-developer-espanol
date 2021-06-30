
/* Watson Discord BOT
  First 3 lines, npm modules imports
  Las primeras 3 lineas importando modulos
*/
const { Client, MessageEmbed, Collection } = require('discord.js');
const fetch = require('node-fetch');
const querystring = require('querystring');
const fs = require('fs');
require('dotenv').config()

const client = new Client();

//Prefijo para los comandos, asi se invocarán cada uno
const prefix = '!'

const trim = (str, max) => str.length > max ? `${str.slice(0, max - 3)}...` : str;

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file =>  file.endsWith('.js'))

for(let file of commandFiles){
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

//Turn on the bot user
// Encender el chatbot
client.on('ready', () => {
  console.log(`💯 Watson AI Bot is online!`);
});


//Summary of all bot responses and actions
//Aqui se recopilan todas los comandos, llamadas a las APIs y respuestas del chatbot.
client.on('message', async msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // list of commands after prefix
    // Lista de comandos luego del prefijo '!'

    // 1. Comandos base y offtopic

    if (command === 'ping'){
      client.commands.get('ping').execute(msg, args);

    } else if (command === 'hi') {
      msg.reply('👁‍🗨🐝Ⓜ Hello friend!');

    } else if (command === 'help') {
      const embed = new MessageEmbed()
        .setColor('#EFFF00')
        .setTitle('Hello! you can use these commands with me:')
        .addField('!mood', 'to know what emotion or feeling is behind your text.')
        .addField('!related', 'What is this website / information related to?')
        .addField('!topic', 'What topics of interest are behind this website / text?')
        .addField('!translate', 'traduce lo que quieras| traduza o que você quiser| 翻译你想要的 -> to the English language')
        .addField('MORE', 'There are also other fun commands that you can find, just try!');
        msg.reply(embed);

    } else if (command === 'cat') {
      const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
      msg.channel.send(file);

    } else if (command === 'urban') {
      if (!args.length) { return msg.reply('You need to supply a search term!'); }

      const query = querystring.stringify({ term: args.join(' ') });
      const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());
      if (!list.length) { return msg.reply(`No results found for **${args.join(' ')}**.`); }
      const [answer] = list;
      console.log(answer);
      //Template of info
      // Template para ordenar información
      const embed = new MessageEmbed()
        .setColor('#EFFF00')
        .setTitle(answer.word)
        .setURL(answer.permalink)
        .addField('Definition', trim(answer.definition, 1024))
        .addField('Example', trim(answer.example, 1024))
        .addField('Rating', `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.`);
        msg.reply(embed);

      // 2. Comandos de Watson AI y llamadas a las APIs
    } else if (command === 'mood'){
      if (!args.length) { return msg.reply('You need to supply a valid mood sentence!'); }
      const mood_comm_text = args.join(' ');
      client.commands.get('Tone Analyzer').execute(msg, mood_comm_text);

    } else if (command === 'topic') {
      if (!args.length) { return msg.reply('You need to supply a URL!'); }
      const topic_comm_text = args[0]
      client.commands.get('Natural Language Understanding Concepts').execute(msg, topic_comm_text);
        
    } else if (command === 'related') {
      if (!args.length) { return msg.reply('You need to supply a URL!'); }
      const related_comm_text = args[0]
      client.commands.get('Natural Language Understanding Categories').execute(msg, related_comm_text);
        
    } else if (command === 'translate') {
      if (!args.length) { return msg.reply('You need to supply a valid sentence to be translated!'); }
      const translate_comm_text = args.join(' ');
      client.commands.get('Language Translator').execute(msg, translate_comm_text);
      
    }

});

token = process.env.DISCORD_TOKEN;
client.login(token);