// Asistente de viajes
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

/**
 * Inicia la conversación con el bot y muestra las respuestas del bot en consola.
 */
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
















