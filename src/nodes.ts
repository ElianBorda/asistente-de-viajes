import { HuggingFaceInference } from "@langchain/community/llms/hf"
import { pipeline } from '@xenova/transformers';
import { HfInference } from '@huggingface/inference'
import { State, Update } from "./graph.js"
import { z } from "zod"
import { ChatAnthropic } from "@langchain/anthropic"
import { ChatOpenAI, OpenAI } from "@langchain/openai"




export const processMessage = async (state: State): Promise<Update> => {   
    const llm = new ChatOpenAI({
        model: "gpt-4o-mini-2024-07-18",
        temperature: 0
    });

    const structuredLlm = llm.withStructuredOutput(z.object({
        type: z.enum(["Destination", "LuggageAndClimate", "Other"]).describe("The conversation type can be 'Description', 'LuggageAndClimate', 'Other'"),
    }));

    const res = await structuredLlm.invoke([
        [
            "system",
            `You are an expert assistant in analyzing texts related to travel assistance. Your goal is to analyze user texts, identify key issues and provide accurate and actionable solutions. “Destination” if you are talking about suggestions, popular places, among others. “LuggageAndClimate” if you are asking for opinions on ideal suitcase/backpack type, suitable clothing, suitable footwear and/or if you are asking for topics related only to the weather. “Other” if it asks for queries that are not related to the other 3. Respond only with a JSON in the following format: { “type": ‘Destination’ | ‘LuggageAndClimate’ | ”Other” }`,
        ],
        ["human", state.message.message],
    ])

    return {
        messegeType: res.type
    }
}

export const processDestination = async (state: State): Promise<Update> => {
    //TODO esta funcion retorna informacion sobre el destino.

    const llm = new ChatOpenAI({
        model: "gpt-4o-mini-2024-07-18",
        temperature: 0
    });

    const structuredLlm = llm.withStructuredOutput(z.object({
        desc: z.string().describe("Information regarding destinations"),
    }));

    const res = await structuredLlm.invoke([
        [
            "system",
            `You are an expert travel assistant specialized in destinations. Your goal is to provide users with detailed, accurate, and engaging travel recommendations based on their queries. If asked about travel suggestions, provide well-researched destination recommendations, including popular attractions, hidden gems, and best travel experiences. If asked about logistics, offer practical advice on transportation, visas, best travel seasons, and budgeting tips. If asked about gastronomy, describe traditional dishes, must-try foods, and the best places to eat in different regions. If asked about culture, share insights on local customs, historical sites, festivals, and etiquette. If the user asks about general travel tips, provide useful advice to enhance their travel experience. Always respond in a helpful and informative manner, adapting your tone to match the user's request.`,
        ],
        ["human", state.message.message],
    ])



    // console.log("Entramos en el nodo de destino")
    console.log(res.desc)
    return {
        destination: {
            userId: "2",
            description: state.message.message,
        }
    }
}

export const processLuggageAndClimate = async (state: State): Promise<Update> => {
    //TODO esta funcion retorna informacion sobre el equipaje

    const llm = new ChatOpenAI({
        model: "gpt-4o-mini-2024-07-18",
        temperature: 0,
        maxTokens: 150,
    });

    const structuredLlm = llm.withStructuredOutput(z.object({
        desc: z.string().describe("Information regarding luggage and climate"),
    }));

    const res = await structuredLlm.invoke([
        [
            "system",
            `You are an expert travel assistant specializing in weather and packing recommendations. Your goal is to provide users with precise guidance on what clothing and gear to bring based on the destination’s climate and relevant environmental factors. If a user asks about the climate in a specific location, provide an accurate description of the typical weather for their travel period. In addition to describing the weather, suggest appropriate clothing and accessories to ensure comfort and preparedness. If a user asks what to pack for a specific destination, analyze the climate and provide detailed recommendations on clothing, footwear, and accessories suited to the conditions. Consider additional environmental factors such as: If the destination has mountains or rugged terrain, recommend sturdy hiking boots and layered clothing. If the area is coastal, suggest light, breathable clothing, sun protection, and appropriate footwear. If the destination experiences high humidity, recommend moisture-wicking fabrics. If traveling in winter, advise on insulation layers, waterproof gear, and cold-resistant accessories. If traveling during a rainy season, recommend waterproof jackets, umbrellas, and quick-dry clothing. Always ensure recommendations are practical and tailored to the user’s trip duration and activities. Your responses should be clear, actionable, and adapted to the user's travel needs.`,
        ],
        ["human", state.message.message],
    ])


    console.log(res.desc)
    return {
        luggageAndClimate: {
            userId: "2",
            recommendation: "e"
        },
    }
}

export const processOther = async (state: State): Promise<Update> => {
    //TODO esta funcion informa que no es su trabajo responder dicha consulta
    // console.log("Entramos en el nodo de otros")
    return {}
}


 
    // const parsedRes = JSON.parse(res);
    // const validatedRes = resSchema.parse(res);
    
    // console.log("procesa el mensaje para decidir el tipo", res)


    
    // const prompt = `System:Eres un asistente experto en el análisis de textos relacionados con viajes. Analiza cada consulta y clasifícala en uno de los siguientes tipos: "Destination", "Luggage", "Weather" o "Other".  
    // La respuesta debe ser únicamente un JSON en el siguiente formato:
    // {"type": "Destination" | "Luggage" | "Weather" | "Other"}
    // No incluyas ningún texto adicional ni uses otras claves o valores.  
    // Ejemplo 1:  
    // Input: Quiero recomendaciones sobre los mejores lugares para visitar en París.  
    // Output: {"type": "Destination"}  
    // Ejemplo 2:  
    // Input: ¿Qué tipo de maleta debería comprar para un viaje de un mes?  
    // Output: {"type": "Luggage"} Human: ${state.message.message}`;


    //   console.log(res)