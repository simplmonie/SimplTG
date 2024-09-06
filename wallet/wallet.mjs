import { Markup } from 'telegraf';

export default (bot, db) => {
    // Wallet functionality
    bot.action('wallet', async (ctx) => {
        const userId = ctx.from.id;

        // Get user wallet or initialize it
        let wallet = db.data.wallets.find((wallet) => wallet.id === userId);
        if (!wallet) {
            wallet = { id: userId, name: ctx.from.username || ctx.from.first_name, balance: 0 };
            db.data.wallets.push(wallet);
            await db.write();
        }

        ctx.reply(`Your current balance: ${wallet.balance}`, 
            Markup.inlineKeyboard([
                Markup.button.callback('Transfer Coins', 'transfer'),
                Markup.button.callback('Back to Menu', 'menu')
            ])
        );
    });

    // Transfer coins functionality
    bot.action('transfer', (ctx) => {
        ctx.reply('Enter the user ID and amount to transfer in the format: /transfer userId amount');
    });

    // Handle transfer command
    bot.command('transfer', async (ctx) => {
        const [command, userId, amount] = ctx.message.text.split(' ');

        if (!userId || !amount) {
            ctx.reply('Invalid format. Use: /transfer userId amount');
            return;
        }

        const senderId = ctx.from.id;
        const recipientId = parseInt(userId);
        const transferAmount = parseInt(amount);

        if (isNaN(recipientId) || isNaN(transferAmount) || transferAmount <= 0) {
            ctx.reply('Invalid user ID or amount.');
            return;
        }

        let senderWallet = db.data.wallets.find((wallet) => wallet.id === senderId);
        let recipientWallet = db.data.wallets.find((wallet) => wallet.id === recipientId);

        if (!senderWallet || senderWallet.balance < transferAmount) {
            ctx.reply('Insufficient balance.');
            return;
        }

        if (!recipientWallet) {
            ctx.reply('Recipient not found.');
            return;
        }

        // Perform the transfer
        senderWallet.balance -= transferAmount;
        recipientWallet.balance += transferAmount;
        await db.write();

        ctx.reply(`Successfully transferred ${transferAmount} coins to user ${recipientId}. Your new balance: ${senderWallet.balance}`);
        ctx.telegram.sendMessage(recipientId, `You received ${transferAmount} coins from user ${senderId}. Your new balance: ${recipientWallet.balance}`);
    });
}