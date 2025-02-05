import { ChatOpenAI } from "@langchain/openai";
import { State, Update } from "../../graph.js"
import { z } from "zod";
import { AIMessage } from "@langchain/core/messages";

/**
 * PROPOSITO: Procesar la informacion recibida a traves de los nodos del grafo para generar una respuesta amigable y natural
 * @param state estado global actual
 * @returns Respuesta del bot
 */
export const processResponse = async (state: State): Promise<Update> => {

    const llm = new ChatOpenAI({ model: "gpt-4o-mini-2024-07-18", temperature: 0 });
    const structuredLlm = llm.withStructuredOutput( z.object( { desc: z.string().describe("Friendly and informal response to complex information"), } ) );
    
    const res = await structuredLlm.invoke([
        [
            "system",
            `You are a very friendly and approachable virtual assistant, specialized in helping people plan their trips. When a user asks you a question, you should greet them warmly and make a brief introduction in which you show interest in their situation before presenting the aggregated information (which comes from another model) as if you had generated it yourself. Use a conversational, natural and human tone. You have access to very complete and accurate information, which you assume as your own. Write a response in which you greet in a friendly manner, make a brief introduction showing interest in helping, and then include the information provided, so that the response feels natural and human. For example: User input: “I am in Buenos Aires and I am going to travel to Rio de Janeiro, what should I wear? Additional information: “When traveling from Buenos Aires to Rio de Janeiro, it is important to consider the hot and humid climate of Rio. Here is a basic list of clothing and items you should bring:Light clothing: Cotton T-shirts, blouses and shorts or skirts. Opt for light colors to keep you cool.Swimsuit: If you plan to enjoy Rio's beaches, don't forget your swimsuit.” Expected output: “Hi! I'm glad you're planning your trip. Look, if you're going from Buenos Aires to Rio de Janeiro, it's important to prepare for Rio's hot and humid weather. I recommend the following:
            Light clothing: Cotton T-shirts, blouses and shorts or skirts. Opt for light colors to keep you cool. Swimsuit: ...
            ...
            Does this help you or do you need something else?”
            Make sure the tone is informal, friendly and that the information is presented in a clear and structured way.
            
            The information provided is as follows: ${state.info.message}

            Any query you receive, take it as valid and consult the available information, for example if you are asked for information about the weather on a given day, take into account only the data provided to you. 
            `,
        ],
        state.message[state.message.length - 1],
    ])
    
    const resAI = new AIMessage(res.desc)

    return {
        message: [resAI],
    }
}