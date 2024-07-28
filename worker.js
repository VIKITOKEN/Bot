import db from "./Database.js";
import axios from 'axios';
import { parentPort } from 'worker_threads'
import { numberFormat } from "./Formater.js";

const {  telegramBotToken, liquidityEndpoint, 
   telegramEndpoint, whaleImage, buyImage, megaImage, buyTransactionEndpoint, stxEventEndpoint,
} = process.env;


const telegramSendImageBot = async (transactionDetail)=> {
 
   const {caption, buyBotImage} =  transactionDetail,
   telegramUsers = await db.prepare('SELECT * FROM telegramUsers').all();

   for (let i = 0, leng= telegramUsers.length; i < leng; i++) {
      
      const { telegramID } = telegramUsers[i],
      telegramId = telegramID.split('.')[0],
      telegramImageUrl = `${telegramEndpoint}${telegramBotToken}/sendPhoto?chat_id=${telegramId}`;
      
      const response = await fetch(telegramImageUrl, {
         method: 'POST',
         body: JSON.stringify({caption, photo:buyBotImage }),
         headers: { 'Content-Type': 'application/json' },
            
      })

     await response.json();
   }
}

// , parse_mode:telegram.ParseMode.HTML 

const transactionToken =  async(tokens) => {
   try {
      const transactionCountQuery = await db.prepare('SELECT COUNT(*) AS count FROM buyTransaction WHERE transactionID = ?'),
      transactionInsertQuery = await db.prepare('INSERT INTO buyTransaction (transactionID) VALUES (@transactionID)');
   
      for (let i = 0, leng= tokens.length; i < leng; i++) {
         
         const transactionURL = `${liquidityEndpoint}${tokens[i]}/transactions`,
         { data:{results} } =  await axios.get(`${transactionURL}?limit=10`);
        
         if (!results) continue;
         const successfullyTransaction = results.filter(item=>item['tx']['tx_status'] === "success");
        
         await successfullyTransaction.map(async (item)=>{
            const {tx:{tx_id, parent_burn_block_time_iso} } = item;
            try {
               const { count } = await transactionCountQuery.get(tx_id);
               
               if (count > 0 ) return;
               const {data: {events}} = await axios.get(`${stxEventEndpoint}${tx_id}`);
               
               if(!events[1]) return;
               const [{asset: { amount } }, {asset: { asset_id }} ]= events;
               
               if(!asset_id)return;
               if(!(asset_id.includes(":viking") || asset_id.includes(":odin"))) return;
               
               // console.log({amount, asset_id, tx_id})

               const stxInFloat = (+amount / 1000000).toFixed(2),
               tokenName = (asset_id.includes(":viking")?"VIKI":"ODIN"),  
               buyBotImage =(stxInFloat<=500?buyImage:( stxInFloat <=2000 ? megaImage: whaleImage ));

               const transactionDetail = {
                  buyBotImage,
                  caption :`BUY : ${numberFormat(stxInFloat)} STX TO ${tokenName}\n${buyTransactionEndpoint}${tx_id}?chain=mainnet\nBuy on vikingswap.io`
               };
               await transactionInsertQuery.run({transactionID:tx_id});
               await telegramSendImageBot(transactionDetail); 
            } catch (error) {
               console.error('Error fetching transactions:', error);
            }
              
         }) 
      }
   } catch (error) {
      console.error('Error fetching transactions:', error);
   }

}
parentPort.on('message', transactionToken );


           
         // BUY : 300.00000000 STX (~878.99 USD){price: { stxPrice }} 
         // const {data: {price:stxPrice}} = await axios.get(`${stxPriceEndpoint}${parent_burn_block_time_iso}`);
         // if (!stxPrice) continue;