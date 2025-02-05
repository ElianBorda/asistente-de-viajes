import { ChatOpenAI } from "@langchain/openai";
import { State, Update } from "../../graph.js"
import { z } from "zod";
import { AIMessage } from "@langchain/core/messages";


/**
 * PROPOSITO: Procesar la informacion recibida a traves de los nodos del grafo para aclarar que el bot solo puede responder preguntas relacionadas con asistencia de viaje
 * @param state Estado global actual
 * @returns respuesta del bot
 */
export const processOther = async (state: State): Promise<Update> => {
    const llm = new ChatOpenAI({
        model: "gpt-4o-mini-2024-07-18",
        temperature: 0
    });

    llm.bindTools([state.message])
    const structuredLlm = llm.withStructuredOutput(z.object({
        desc: z.string().describe("Friendly, informal and honest only related to the fact that inquiries should be focused on travel assistance. "),
    }));
    const res = await structuredLlm.invoke([
        ["system", "Your task is to say that you will help him with travel assistance issues. Such as weather, luggage and destinations."],
        state.message[state.message.length - 1]
    ])
    const resAI = new AIMessage(res.desc)
       
    return {
        message: [resAI]
    }
}