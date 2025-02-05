// Asistente de viajes
import { HumanMessage } from "@langchain/core/messages";
import { createGraph } from "./graph.js";
import dotenv, { config } from 'dotenv';
import readline from "readline/promises";
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
    const input = new HumanMessage(userInput)
    const configMemory = { configurable: { thread_id: "2"} }
    const res = await graph.stream({ message: [ input ] }, { ...configMemory, streamMode: "values",
      })

    let finalEvent;
    for await (const event of res) {
        finalEvent = event
    }
    console.log("\nBot:", finalEvent.message[finalEvent.message.length - 1].content);
  }

  rl.close();
}



chat();
















