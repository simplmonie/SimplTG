// bot.mjs
import { Telegraf, Markup } from 'telegraf';
import express from 'express';

export function initBot(token) {
  const bot = new Telegraf(token);
  const app = express();

  bot.start((ctx) => {
    ctx.reply('Welcome!', Markup.inlineKeyboard([
      [Markup.button.callback('Clicker', 'clicker')],
      [Markup.button.callback('Miner', 'miner')],
      [Markup.button.callback('Wallet', 'wallet')]
    ]));
  });

  bot.launch().then(() => console.log('Bot started'));
  app.listen(process.env.PORT || 4000, () => {
    console.log('Server running on port 4000');
  });

  return bot;
}

