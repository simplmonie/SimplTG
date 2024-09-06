import { config } from 'dotenv';
import { Telegraf, Markup } from 'telegraf';
import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// Configure environment variables
config();

// Initialize bot and express
const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

// Set up lowdb
const adapter = new JSONFile('db.json');
const db = new Low(adapter, {});

// Initialize the database with default values if not present
await db.read();
if (!db.data) {
  db.data = {
    scores: [],
    wallets: [],
    miners: []
  };
  await db.write();
} else {
  db.data.scores = db.data.scores || [];
  db.data.wallets = db.data.wallets || [];
  db.data.miners = db.data.miners || [];
  await db.write();
}

// Import functionality modules (make sure these files are available)
import clicker from './clicker/clicker.mjs';
import miner from './miner/miner.mjs';
import wallet from './wallet/wallet.mjs';

// Initialize modules
clicker(bot, db);
miner(bot, db);
wallet(bot, db);

// Start command
bot.start((ctx) => {
  ctx.reply('Welcome to the Miner Clicker Bot! Choose an option below:',
    Markup.inlineKeyboard([
      [Markup.button.callback('Start Game', 'start_game')],
      [Markup.button.callback('Clicker', 'clicker')],
      [Markup.button.callback('Miner', 'miner')],
      [Markup.button.callback('Wallet', 'wallet')],
      [Markup.button.callback('Help', 'help')],
      [Markup.button.callback('Main Menu', 'menu')]
    ])
  );
});

// Main menu
bot.action('menu', (ctx) => {
  ctx.reply('Main Menu',
    Markup.inlineKeyboard([
      [Markup.button.callback('Start Game', 'start_game')],
      [Markup.button.callback('Clicker', 'clicker')],
      [Markup.button.callback('Miner', 'miner')],
      [Markup.button.callback('Wallet', 'wallet')],
      [Markup.button.callback('Help', 'help')],
      [Markup.button.callback('Settings', 'settings')]
    ])
  );
});

// Start game action
bot.action('start_game', (ctx) => {
  ctx.answerCbQuery(); // Answer the callback query
  ctx.replyWithGame('Snappy'); // Replace 'Snappy' with your game's short name
});

// Handle game query
bot.gameQuery((ctx) => {
  ctx.answerGameQuery('https://your-game-url.com'); // Replace with your game's URL
});

// Bot launch and server setup
bot.launch().then(() => console.log('Bot started in polling mode'));
app.listen(process.env.PORT || 4000, () => {
  console.log('Server running on port 4000');
});