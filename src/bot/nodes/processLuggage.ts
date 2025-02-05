import { ChatOpenAI } from "@langchain/openai";
import { State, Update } from "../../graph.js";
import { z } from "zod";

/**
 * PROPOSITO: Procesar la informacion recibida a traves de los nodos para generar una respuesta relacionada con el equipaje del usuario. 
 * @param state Estado global actual
 * @returns respuesta del bot
 */
export const processLuggage = async (state: State): Promise<Update> => {
    //TODO esta funcion retorna informacion sobre el equipaje

    const llm = new ChatOpenAI({
        model: "gpt-4o-mini-2024-07-18",
        temperature: 0,
    });

    const structuredLlm = llm.withStructuredOutput(z.object({
        desc: z.string().describe("Information regarding luggage"),
    }));

    const res = await structuredLlm.invoke([
        [
            "system",
            `You are a luggage expert. In the consultation you identify the destination and generate a basic list of things to take with you, taking into account mainly the travel from one point to the destination or the weather in general.`,
        ],
        state.message[state.message.length - 1],
    ])

    return {
        luggage: {
            userId: "2",
            destination: "Argentina",
            durationTravel: "2 weeks",
            recommendation: res.desc,
        },
        info: {
            message: res.desc,
        },
    }
}