import { ChatOpenAI } from "@langchain/openai";
import { State, Update } from "../../graph.js";
import { z } from "zod";

export const processLuggage = async (state: State): Promise<Update> => {
    //TODO esta funcion retorna informacion sobre el equipaje

    const llm = new ChatOpenAI({
        model: "gpt-4o-mini-2024-07-18",
        temperature: 0,
    });

    const structuredLlm = llm.withStructuredOutput(z.object({
        desc: z.string().describe("Information regarding luggage and climate"),
    }));

    const res = await structuredLlm.invoke([
        [
            "system",
            `You are a luggage expert. In the consultation you identify the destination and generate a basic list of things to take with you, taking into account mainly the travel from one point to the destination or the weather in general.`,
        ],
        ["human", state.message.message],
    ])


    return {
        luggage: {
            userId: "2",
            destination: "Argentina",
            durationTravel: "2 weeks",
            recommendation: "Recomendation"
        },
    }
}