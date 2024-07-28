import db from "./Database.js";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import express from "express";

import { Worker } from 'worker_threads'





const app = express(),
__filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);


// Serve static files from the public directory
app.use(express.static(join(__dirname, 'public')));


const worker = new Worker('./worker.js')



const ewewwewe = ()=> {
	worker.on('message', (counter) => {
		db.close();
		// setTimeout(ewewwewe, 10000); 
      console.log(`Received message from worker: ${counter}`); 
   });
	const token = [
   	'SPNZPTGSBE66R85NZWZMQJ7ZNK514CXV1CWEB2MQ.odn-aggregator',
		'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.univ2-core',
		'SP31BV8VGBSGAR453P6PEQ9SB3AMYMZ1ATBPWDGKY.aggregator-viking'
	];
	 const consoleValue = 'I dey try run ooooo';
	worker.postMessage(token);
	// 
	console.log("hello")
	// 
} 
ewewwewe();


// const ewewwewe = async ()=> {

	// let count = 1;

	// while (count <= 3) {
	// 	console.log('Count:', count);
	// 	count++;
	// }

	// token.length
//   await apiUrl = "https://api.hiro.so/extended/v2/addresses/SPNZPTGSBE66R85NZWZMQJ7ZNK514CXV1CWEB2MQ.odn-aggregator/transactions?limit=1"
//   // const key = "1002196926652"
//   const dd= [1,2,3]
//   while (dd.length) {
    
//   }
//   Promise.allSettled([])
// }

// const insertUser = db.prepare('INSERT INTO users (name, email) VALUES (@name, @email)');
// const newUser = { name: 'John Doe', email: 'john@example.com' };

// try {
//   const result = insertUser.run(newUser);
//   console.log('New user inserted with ID:', result.lastInsertRowid);
// } catch (error) {
//   console.error('Error inserting user:', error.message);
// }

// // Close the database connection
// 
