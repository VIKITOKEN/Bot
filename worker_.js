import db from "./Database.js";
import { parentPort } from 'worker_threads'
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// 
   // join(__dirname, "mega.jpeg")

const telegramBotToken = "7283517935:AAHltimetAdGotRAnwlaNP6areTd75fIqHQ",
image = "https://img.freepik.com/free-vector/realistic-neon-lights-background_23-2148907367.jpg";

const telegramSendImageBot = async (caption, photo)=> {
   const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendPhoto?chat_id=-1002196926652`;

   const response = await fetch(telegramUrl, {
      method: 'POST',
      body: JSON.stringify({caption, photo }),
      headers: { 'Content-Type': 'application/json', },
   });
   const data = await response.json();
   console.log('telegramSendImageBot')
}

const transactionToken =  async(token) => {
   let i = 0;
   const transactionDetail = [],
   tokenLength = token.length - 1,
   __filename = fileURLToPath(import.meta.url),
   transactionCountQuery = db.prepare('SELECT COUNT(*) AS count FROM buyTransaction WHERE transactionID = ?');
   const transactionInsertQuery = db.prepare('INSERT INTO buyTransaction (transactionID) VALUES (@transactionID)');

   const __dirname = dirname(__filename);
   
   while (i <= tokenLength) {
      const apiUrl = `https://api.hiro.so/extended/v2/addresses/${token[i]}/transactions?limit=1`;

      const response = await fetch(apiUrl);
      const data = await response.json();
      const {tx:{tx_id, tx_status} }= data['results'][0];

      const result = transactionCountQuery.get(tx_id),
      buyTransaction = `https://explorer.hiro.so/txid/${tx_id}?chain=mainnet`;
      i++;
      if (result.count > 0 || tx_status!=="success") continue;
      transactionInsertQuery.run({transactionID:tx_id});
      await telegramSendImageBot(buyTransaction, image);
      console.log('transactionToken');
	}
   parentPort.postMessage(i);
   console.log('Done');
   
}

parentPort.on('message', transactionToken );