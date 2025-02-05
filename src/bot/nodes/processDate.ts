import { ChatOpenAI } from "@langchain/openai";
import { State, Update } from "../../graph.js";
import { z } from "zod";

/**
 * PROPOSITO: Procesar la informacion recibida para identificar la fecha y la localizacion y devolver la respuesta en formato JSON con la localizacion, la fecha y las coordenadas
 * @param state Estado global actual
 * @returns respuesta del bot
 */
export const processDate = async (state: State): Promise<Update> => {
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
            You are an expert in date analysis. Your task is to parse the query, get the date, and if it is not in the “YYYYY-MM-DD” format, convert it to that format. In addition, you have to analyze the location and get its latitude and longitude. Take into account the current date ${dateToday}. Just respond with the following JSON: 
                {
                    location: string;
                    date: string;
                    latitude: number;
                    longitude: number;
                }  
                
                Other examples:
                Example 1: What will the weather be like in Madrid on December 25?.
                Output: 
                {  
                    "location": "Madrid, Spain",  
                    "date": "2023-12-25",  
                    "latitude": 40.4168,  
                    "longitude": -3.7038  
                } 
                Example 2: I need the forecast for New York on 02/14/2024?
                Output:
                {  
                    "location": "New York, USA",  
                    "date": "2024-02-14",  
                    "latitude": 40.7128,  
                    "longitude": -74.0060  
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