import { Markup } from 'telegraf';

let messageCounter = 0;
let prevScore = null;

export default (bot, db) => {
  bot.action('clicker', (ctx) => {
    ctx.reply('Welcome to the Clicker Game! Click the button below to increase your score.', Markup.inlineKeyboard([
      Markup.button.callback('Click Me!', 'click'),
      Markup.button.callback('Back to Menu', 'menu')
    ]));
  });

  bot.action('click', async (ctx) => {
    const userId = (ctx.from.id);
    const userName = ctx.from.username || ctx.from.first_name;
    let user = db.data.scores.find((user) => (user.id) === userId);
    let userWallet = db.data.wallets.find((wallet) => wallet.userId === userId);

    if (!user) {
      user = { id: userId, name: userName, score: 0 };
      db.data.scores.push(user);
      await db.write();
      prevScore = user.score;
    }

    if (!userWallet) {
      userWallet = { userId, resources: 0 };
      db.data.wallets.push(userWallet);
      await db.write();
    }

    user.score += 1;
    userWallet.resources += 1; // Increment resources by 1
    await db.write();

    if (prevScore !== user.score) {
      prevScore = user.score;
      if (messageCounter < 5) {
        messageCounter++;
        const newText = `Your score: ${user.score} (Resources: ${userWallet.resources})`;
        if (ctx.message && ctx.message.text && newText !== ctx.message.text) {
          ctx.editMessageText(newText, Markup.inlineKeyboard([
            Markup.button.callback('Click Me!', 'click'),
            Markup.button.callback('Back to Menu', 'menu')
          ]));
        } else if (ctx.callbackQuery && ctx.callbackQuery.message) {
          ctx.editMessageText(newText, Markup.inlineKeyboard([
            Markup.button.callback('Click Me!', 'click'),
            Markup.button.callback('Back to Menu', 'menu')
          ]));
        }
      }
    }

    setTimeout(() => messageCounter = 0, 5000);
  });
};

