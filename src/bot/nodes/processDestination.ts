import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { State, Update } from "../../graph.js";

/**
 * PROPOSITO: Procesar la informacion recibida a traves de los nodos para generar una respuesta relacionada con el destino del usuario. 
 * @param state Estado global actual
 * @returns respuesta del bot
 */
export const processDestination = async (state: State): Promise<Update> => {
    

    const llm = new ChatOpenAI({model: "gpt-4o-mini-2024-07-18", temperature: 0 });
    const structuredLlm = llm.withStructuredOutput(z.object({
        desc: z.string().describe("Information regarding destinations"),
    }));

    const res = await structuredLlm.invoke([
        [
            "system",
            `You are an expert travel assistant specializing in destinations. Your goal is to provide users with concise yet informative responses. Each response should include: The name of the destination. Its geographical location (country, region, or city). A brief description highlighting its main appeal. Keep responses short and to the point, avoiding unnecessary details. Your goal is to provide quick and useful information while maintaining clarity.`,
        ],
        state.message[state.message.length - 1],
    ])

    return {
        destination: {
            userId: "2",
            description: res.desc,
        },
        info: {
            message: res.desc,
        },
    }
}