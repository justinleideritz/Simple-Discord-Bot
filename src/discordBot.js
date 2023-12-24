const { Client, IntentsBitField } = require("discord.js");
const fs = require('fs');
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

//Bot start up
const token =
  "YOUR TOKEN"; //Add you bot token here 
client.login(token);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//Bot Functionality

//Word counter
const wordToTrack = "YOURWORDTOTRACK"; //Change this to your desired word you want to track
let wordCount = 0;
// Load the count from a file if it exists
fs.readFile('wordCount.txt', 'utf8', (err, data) => {
  if (!err && data) {
    wordCount = parseInt(data); // Parse the count from the file
    console.log(`Word count loaded: ${wordCount}`);
  }
});
client.on("messageCreate", (message) => {
  // Check if the message contains the word you want to track
  if (
    !message.author.bot &&
    message.content.toLowerCase().includes(wordToTrack.toLowerCase())
  ) {
    wordCount++;
    fs.writeFile('wordCount.txt', wordCount.toString(), (err) => {
      if (err) {
        console.error('Error saving word count:', err);
      } else {
        console.log('Word count saved.');
      }
    });
  }
  // Check if the user wants to see the count
  if (message.content.toLowerCase() === "!counter") {
    message.channel.send(
      `The word "${wordToTrack}" has been said ${wordCount} times.`
    );
  }
  
  
  //show all commands
  if (message.content.toLowerCase() === "!commands") {
    message.channel.send(
      `Commands:
      !counter (See how many times the word "test" has been said)
      !coinflip (Take a guess what this command does...)
      !random (Example !random 10 for a random number lower than 10)`
    );
  }


  //Coinflip
  if (message.content.toLowerCase() === "!coinflip") {
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    message.channel.send(`The coin landed on: ${result}`);
  }

  //Random number
  if (message.content.toLowerCase() === "!random") {
    message.channel.send(
      `If you want to get a random number, provide a number after !random. (Example: !random 10)`
    );
  }
  if (message.content.toLowerCase().startsWith("!random ")) {
    const args = message.content.split(" ");
    if (args.length === 2 && !isNaN(args[1])) {
      const maxNumber = parseInt(args[1]);
      const randomNumber = Math.floor(Math.random() * maxNumber) + 1;
      message.channel.send(
        `${randomNumber}`
      );
    } else {
      message.channel.send(
        "Please provide a valid number after the command, like `!random 10`."
      );
    }
  }
});