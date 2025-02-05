import { ChatOpenAI } from "@langchain/openai";
import { State, Update } from "../../graph.js"
import { z } from "zod";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

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