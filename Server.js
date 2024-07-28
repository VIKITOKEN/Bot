import cron from "node-cron";
import db from "./Database.js";
import express from "express";
import  TelegramBot from "node-telegram-bot-api";

import { Worker } from 'worker_threads';

// process.on('uncaughtException', err => {
//    console.log(err);
//    console.log('UNCAUGHT EXCEPTION! shutting down....');
//    process.exit(1);
// });





const {  telegramBotToken, nameDomain } = process.env,
worker = new Worker('./worker.js'),
bot = new TelegramBot(telegramBotToken, {polling: true});

bot.on('polling_error', (error) => {
   console.error('Polling error:', error.message);
});

// Event listener for incoming messages
bot.on('message',async (msg) => {
   const {chat:{id:chatId}, text, message_id} = msg,
   {count} =await db.prepare('SELECT COUNT(*) AS count FROM telegramUsers WHERE telegramID = ?').get(chatId);
   if (count > 0) return;
   await db.prepare('INSERT INTO telegramUsers (telegramID) VALUES (@telegramID)').run({telegramID:chatId});

   //  const messageId = msg.message_id;
   console.log(chatId, text, message_id)
   const sticker = "https://cdn-icons-png.flaticon.com/256/9236/9236781.png"
   if (text!=='/useBot')return 
   bot.sendSticker(chatId, sticker, { reply_to_message_id: message_id })
   .then(() =>  console.log('Sticker sent as reply'))
   .catch((error) => console.error('Error sending sticker:', error));
});

const transactionToken = async()=> {
   const { count } = await db.prepare('SELECT COUNT(*) AS count FROM telegramUsers').get();
   if(count < 1) return;

	worker.on('message', (counter) => {
		// db.close();
      console.log(`Received message from worker: ${counter}`); 
   });

   const token = [
      "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.univ2-core",
      "SPNZPTGSBE66R85NZWZMQJ7ZNK514CXV1CWEB2MQ.odn-aggregator",
      "SP31BV8VGBSGAR453P6PEQ9SB3AMYMZ1ATBPWDGKY.aggregator-viking"
   ];
   
	worker.postMessage(token);
} 
transactionToken();

cron.schedule('1 * * * * *', async () => {
   await transactionToken();
   console.log('Running a task every minute');
});


process.on('unhandleRejection', err => {
   console.log(err.name, err.message);
   console.log('UNHANDLED REJECTION! shutting down....');
   server.close(() => { process.exit(1); });
});
 