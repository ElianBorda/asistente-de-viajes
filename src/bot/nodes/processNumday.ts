import { ChatOpenAI } from "@langchain/openai";
import { State, Update } from "../../graph.js";
import { z } from "zod";

/**
 * PROPOSITO: Procesar la informacion recibida a identificar la cantidad de dias y la localizacion y devolver la respuesta en formato JSON con la localizacion, la fecha y las coordenadas
 * @param state Estado global actual
 * @returns respuesta del bot
 */
export const processNumday = async (state: State): Promise<Update> => {
    
    const llm = new ChatOpenAI({
        model: "gpt-4o-mini-2024-07-18",
        temperature: 0,
    });

    const structuredLlm = llm.withStructuredOutput(z.object({
        location: z.string().describe("Information regarding luggage and climate"),
        date: z.string().describe("Date from which the weather is determined"),
        latitude: z.number().describe("Latitude of the location"),
        longitude: z.number().describe("Longitude of the location"),
    }));

    const dateToday = new Date();

    const res = await structuredLlm.invoke([
        [
            "system",
            `
            You are an expert in date analysis. Your task is to parse the query, get the number of days, and transform it to date in the format “YYYYY-MM-DD” taking into account the current date ${dateToday}. In addition, you have to analyze the location and get its latitude and longitude. Just respond with the following JSON: 
                {
                    location: string;
                    date: string;
                    latitude: number;
                    longitude: number;
                } 
                Example 1: What will be the temperature in cancun in 3 days? (Current date is 21th December).
                {
                    location: “Cancun”,
                    date: “2023-12-24” 
                    latitude: 21.1619,
                    longitude: -86.8515,
                }
            `,
        ],
        state.message[state.message.length - 1],
    ])

    return {
        climate:{
            ...state.climate,
            location: res.location,
            date: res.date,
            lat: res.latitude,
            lon: res.longitude,
        }    
    }
}