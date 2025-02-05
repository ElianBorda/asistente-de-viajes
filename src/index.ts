// Asistente de viajes
import { HumanMessage } from "@langchain/core/messages";
import { createGraph } from "./graph.js";
import dotenv, { config } from 'dotenv';
import readline from "readline/promises";
import { getResponseBot } from "./utils/getResponseBot.js";
dotenv.config();
process.removeAllListeners('warning');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


const graph = createGraph()

async function chat() {
  while (true) {
    const userInput = await rl.question("\nTú: ");
    if (userInput === "exit") { break; }
    const res = await getResponseBot(graph, userInput);   
    console.log("\nBot:", res); 
  }

  rl.close();
}



chat();
















