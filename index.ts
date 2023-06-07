import { Telegraf } from 'telegraf';
import axios from 'axios';
require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN || 'undefined';
const AUTHORIZED_USER_ID = process.env.AUTHORIZED_USER_ID;


async function getPublicIP(): Promise<any> {
    try {
        const response = await axios.get('https://api.ipify.org');
        console.log('Your public IP is: ' + response.data.ip);
        return response;
    } catch (error) {
        console.log('Error: ', error);
    }
}

const bot = new Telegraf(BOT_TOKEN);

// You can replace this with your own id

bot.start((ctx) => {
  if (ctx.from?.id.toString() === AUTHORIZED_USER_ID) {
    ctx.reply('Welcome!');
  }
});

bot.command('getip', async (ctx) => {
  // Checking if the user is authorized
  if (ctx.from?.id.toString() === AUTHORIZED_USER_ID) {
    // Note: Telegram doesn't provide a way to get the IP address of a user.
    // You need an external service to get the IP address.
    // For the purpose of the example, let's assume the IP is gotten from an external service and is stored in ipAddress variable.
    const ipAddress = await getPublicIP();
    await ctx.reply(`Your IP address is: ${ipAddress.data}`);
  } else {
    await ctx.reply('Sorry, you are not authorized to use this bot.');
  }
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
