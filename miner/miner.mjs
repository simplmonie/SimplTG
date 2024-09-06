import { Markup } from 'telegraf';
const intervals = {};

export default (bot, db) => {
  bot.action('miner', async (ctx) => {
    try {
      const userId = (ctx.from.id);
      const chatId = (ctx.chat.id);
      const userName = ctx.from.username || ctx.from.first_name;

      let wallet = db.data.wallets.find((wallet) => (wallet.id) === userId);
      if (!wallet) {
        wallet = { id: userId, name: userName, balance: 0, chatId };
        db.data.wallets.push(wallet);
        await db.write();
      }

      let miner = db.data.miners.find((miner) => (miner.id) === userId);
      if (!miner) {
        miner = { id: userId, intervalId: null };
        db.data.miners.push(miner);
        await db.write();
      }

      if (!miner.intervalId) {
        const mine = async () => {
          wallet.balance += 480;
          await db.write();
          ctx.telegram.sendMessage(chatId, `You mined 480 coin! Your new balance: ${wallet.balance}`);
        };
        const intervalId = setInterval(mine, 28800000); // 8 hours in milliseconds
        miner.intervalId = intervalId;
       delete miner.intervalId;
        await db.write();
        ctx.reply('Mining started! You will receive 480 coins in 8 hours.', Markup.inlineKeyboard([
          Markup.button.callback('Stop Mining', 'stop_mining'),
          Markup.button.callback('Back to Menu', 'menu')
        ]));
      } else {
        ctx.reply('You are already mining!', Markup.inlineKeyboard([
          Markup.button.callback('Stop Mining', 'stop_mining'),
          Markup.button.callback('Back to Menu', 'menu')
        ]));
      }
    } catch (err) {
      console.error(err);
    }
  });

  bot.action('stop_mining', async (ctx) => {
    try {
      const userId = (ctx.from.id);
      let miner = db.data.miners.find((miner) => (miner.id) === userId);
      if (miner && miner.intervalId) {
        clearInterval(miner.intervalId);
        miner.intervalId = null;
        await db.write();
        ctx.reply('Mining stopped.', Markup.inlineKeyboard([
          Markup.button.callback('Start Mining', 'miner'),
          Markup.button.callback('Back to Menu', 'menu')
        ]));
      } else {
        ctx.reply('You are not currently mining.', Markup.inlineKeyboard([
          Markup.button.callback('Start Mining', 'miner'),
          Markup.button.callback('Back to Menu', 'menu')
        ]));
      }
    } catch (err) {
      console.error(err);
    }
  });

  bot.action('menu', async (ctx) => {
    ctx.reply('Main Menu', Markup.inlineKeyboard([
      Markup.button.callback('Start Mining', 'miner'),
      Markup.button.callback('Check Balance', 'balance'),
      Markup.button.callback('Help', 'help'),
      Markup.button.callback('How to Mine', 'how_to_mine'),
      Markup.button.callback('FAQ', 'faq'),
    ]));
  });

  bot.action('balance', async (ctx) => {
    try {
      const userId = (ctx.from.id);
      const wallet = db.data.wallets.find((wallet) => (wallet.id) === userId);
      if (wallet) {
        ctx.reply(`Your balance: ${wallet.balance}`);
      } else {
        ctx.reply("You don't have a wallet yet!");
      }
    } catch (err) {
      console.error(err);
    }
  });

  bot.action('help', async (ctx) => {
    ctx.reply('Help menu', Markup.inlineKeyboard([
      Markup.button.callback('How to Mine', 'how_to_mine'),
      Markup.button.callback('FAQ', 'faq'),
      Markup.button.callback('Back to Menu', 'menu')
    ]));
  });

  bot.action('how_to_mine', async (ctx) => {
    ctx.reply('How to Mine: Click on Miner to begin, Click on Stop to end,');
  });

  bot.action('faq', async (ctx) => {
    ctx.reply('FAQ: Q: How do I start mining? A: Click the "Start Mining" button. Q: How do I stop mining? A: Click the "Stop Mining" button. Q: How do I check my balance? A: Click the "Check Balance" button. Q: How often do I get coins? A: You get 480 coins every 8 hours. Q: What is the purpose of mining? A: Mining earns you coins to track your balance.', Markup.inlineKeyboard([
      Markup.button.callback('Back to Menu', 'menu')
    ]));
  });
};
