import { ChatOpenAI } from "@langchain/openai";
import { State, Update } from "../../graph.js";
import { z } from "zod";

/**
 * PROPOSITO: Procesar la informacion recibida para identificar el tipo de conversacion y devolver la respuesta en formato JSON con el tipo de conversacion
 * @param state Estado global actual
 * @returns Respuesta del bot
 */
export const processMessage = async (state: State): Promise<Update> => {   
    
    const llm = new ChatOpenAI({
        model: "gpt-4o-mini-2024-07-18",
        temperature: 0
    });

    

    const structuredLlm = llm.withStructuredOutput(z.object({
        type: z.enum(["Destination", "Luggage", "Climate", "Other"]).describe("The conversation type can be 'Description', 'Luggage','Climate', 'Other'"),
    }));

    const res = await structuredLlm.invoke([
        [
            "system",
            `You are an expert assistant in analyzing texts related to travel assistance. Your goal is to analyze user texts, identify key issues and provide accurate and actionable solutions. “Destination” if you are talking about suggestions, popular places, among others. “Luggage” if you are asking for opinions on ideal suitcase/backpack type, suitable clothing, suitable footwear. "Climate" if you are asking for topics related only to the weather. “Other” if it asks for queries that are not related to the other 3. Respond only with a JSON in the following format: { “type": 'Destination' | 'Luggage' | 'Climate’ | 'Other' }`,
        ],
        state.message[state.message.length - 1],
    ])
    
    return {
        messegeType: state.messegeType === res.type ? "Memory" : res.type
    }
}

