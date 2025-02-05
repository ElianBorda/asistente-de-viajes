import { ChatOpenAI } from "@langchain/openai";
import { State, Update } from "../../graph.js"
import { z } from "zod";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

/**
 * PROPOSITO: Procesar la informacion recibida a traves de los nodos para generar una respuesta amigable y natural en base al historial de la conversacion
 * @param state Estado global actual
 * @returns respuesta del bot
 */
export const processMemory = async (state: State): Promise<Update> => {
    
    const llm = new ChatOpenAI({
            model: "gpt-4o-mini-2024-07-18",
            temperature: 0
    });

    const structuredLlm = llm.withStructuredOutput(z.object({
        desc: z.string().describe("Information on weather, luggage or destinations"),
    }));
    const res = await structuredLlm.invoke(state.message)
    const resAI = new AIMessage(res.desc)
        
    return {
        message: [resAI]
    }
}