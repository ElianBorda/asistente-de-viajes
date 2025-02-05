import { ChatOpenAI } from "@langchain/openai";
import { getClimate } from "../../service/Api.js";
import { State, Update } from "../../graph.js";
import { z } from "zod";

/**
 * PROPOSITO: Procesar la informacion recibida a traves de los nodos para generar una respuesta relacionada con el clima del lugar, gracias a la API de clima.
 * @param state Estado global actual
 * @returns respuesta del bot
 */
export const processClimateApi = async (state: State): Promise<Update> => {
    
    const llm = new ChatOpenAI({ model: "gpt-4o-mini-2024-07-18", temperature: 0, });
    const structuredLlm = llm.withStructuredOutput(z.object({
        descWhather: z.string().describe("Description of the climate and temperature of the area"),
    }));
    
    const data = await getClimate(state.climate.lat, state.climate.lon );


    const res = await structuredLlm.invoke([
        [
            "system",
            `
            You are an expert in climatology, your task will be to generate a report of maximum and minimum temperatures, and a description of the weather during different time periods over the date ${state.climate.date}. The source to extract the data will be provided by the following json: 
            
            ${JSON.stringify(data)}
            location: ${state.climate.location}


            The response you should provide should have only the following format:

            “Weather for <location> of date <YYYYYY-MM-DD>.
            - <time hh:mm> with minimum and maximum of <maximum temperature>°C/<minimum temperature>°C. The weather will be <Weather description>.
            - <time hh:mm> with minimum and maximum of <maximum temperature>°C/<minimum temperature>°C. The weather will be <Weather description>.
            - <time hh:mm> with minimum and maximum of <maximum temperature>°C/<minimum temperature>°C. The weather will be <Weather description>.
            - ... (until all times are covered)      
            the language is spanish.      

            Example 1: If date is 2023-12-25 and location is Madrid, Spain. 

            El clima de Madrid de la fecha 25-12-2025:.
            - 00:00 con minimo y maximo de 10°C/15°C. El clima es Despejado.
            - 03:00 con minimo y maximo de 10°C/15°C. El clima es Despejado.
            - 06:00 con minimo y maximo de 10°C/15°C. El clima es Nublado.
            `,
        ],
    ])
    
    return {
        climate:{
            ...state.climate,
            info: res.descWhather
        },
        info: {
            message: res.descWhather,
        },
    }
}