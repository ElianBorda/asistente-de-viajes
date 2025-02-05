import { ChatOpenAI } from "@langchain/openai";
import { State, Update } from "../../graph.js";
import { z } from "zod";

/**
 * PROPOSITO: Procesar la informacion recibida a traves de los nodos para identificar si la consulta tiene una fecha o menciona un numero de dias, y retornar el tipo.
 * @param state Estado global actual
 * @returns respuesta del bot
 */
export const processClimate = async (state: State): Promise<Update> => {

    const llm = new ChatOpenAI({
        model: "gpt-4o-mini-2024-07-18",
        temperature: 0,
    });

    const structuredLlm = llm.withStructuredOutput(z.object({
        estimationDate: z.enum([ "Date", "Numday"]).describe("The information about the type of date provided by the query"),
    }));

    const res = await structuredLlm.invoke([
        [
            "system",
            `
            You are an expert in date analysis. Your goal is to determine if the query has a date, or mentions a number of days. You only have to answer with the following JSON: 
            {
                estimationDate: “Date” | “Numday”
            }
            Example: 
            What will be the weather in Cancun in 4 days ?
            Output: { estimationDate: “Numday” }
            Example2:
            What will be the weather in Cancun on 12/2?
            Output: { estimationDate: “Date”}
            `,
        ],
        state.message[state.message.length - 1],
    ])



    return {
        estimationDate: res.estimationDate,
    }
}