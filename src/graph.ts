import { Annotation, END, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { processMessage } from "./bot/nodes/processMessage.js";
import { processDestination } from "./bot/nodes/processDestination.js";
import { processLuggage } from "./bot/nodes/processLuggage.js";
import { processClimate } from "./bot/nodes/processClimate.js";
import { processOther } from "./bot/nodes/processOther.js";
import { processDate } from "./bot/nodes/processDate.js";
import { processNumday } from "./bot/nodes/processNumday.js";
import { processClimateApi } from "./bot/nodes/processClimateApi.js";
import { processClimateEdge } from "./bot/edges/processClimateEdge.js";
import { processMessageEdge } from "./bot/edges/processMessageEdge.js";
import { BaseMessage } from "@langchain/core/messages";
import { processResponse } from "./bot/nodes/processResponse.js";
import { processMemory } from "./bot/nodes/processMemory.js";

/**
 * Tipos de mensajes que puede distinguir el bot
 */
type MessegeType = 
    | "Destination"
    | "Luggage"
    | "Climate"
    | "Memory"
    | "Other";

/**
 * Tipos de fechas que puede distingir el bot
 *  */    
type EstimationDate = 
    | "Date"
    | "Numday" 
    
/**
 * Información de un mensaje
 *  */ 
type Information = {
    message: string; 
};

/**
 * Descripcion del destino de un viaje
 *  */
type Destination = {
    userId?: string; 
    description: string; 
}


/**
 * Descripcion del equipaje de un viaje
 */
type Luggage = {
    userId?: string;
    destination: string;
    durationTravel: string;
    recommendation: string;
}

/**
 * Clima de un lugar
 */
type Climate = {
    userId?: string;
    location: string;
    lat: number;
    lon: number; 
    date: string;
    info?: string;
}


/**
 * Anotaciones de los nodos del grafo (Inicializacion del grafo)
 */
const graphAnotation = Annotation.Root({
    message: Annotation<BaseMessage[]>({ reducer: (x, y) => x.concat(y), }),
    messegeType: Annotation<MessegeType>(),
    info: Annotation<Information>(),
    destination: Annotation<Destination>(),
    luggage: Annotation<Luggage>(),
    climate: Annotation<Climate>(),
    estimationDate: Annotation<EstimationDate>(),
})

export type State = typeof graphAnotation.State;
export type Update = typeof graphAnotation.Update;

/**
 * Retorna un grafo con los nodos y aristas necesarios para el bot
 * @returns Any
 */
export function createGraph() {
    
    const workflow = new StateGraph(graphAnotation)
        .addNode("process-message", processMessage)
        .addNode("process-destination", processDestination)
        .addNode("process-luggage", processLuggage)
        .addNode("process-climate", processClimate)
        .addNode("process-other", processOther)
        .addNode("process-date", processDate)
        .addNode("process-numday", processNumday)
        .addNode("process-climate-api", processClimateApi)
        .addNode("process-response", processResponse)
        .addNode("process-memory", processMemory)

        .addEdge(START, "process-message")
        .addEdge("process-other", END)
        .addEdge("process-destination", "process-response")
        .addEdge("process-luggage", "process-response")
        .addEdge("process-date", "process-climate-api")
        .addEdge("process-numday", "process-climate-api")
        .addEdge("process-climate-api", "process-response")
        .addEdge("process-response", END)
        .addEdge("process-memory", END)

        .addConditionalEdges("process-climate", processClimateEdge)
        .addConditionalEdges("process-message", processMessageEdge);
    
    const memory = new MemorySaver();
    const graph = workflow.compile({ checkpointer: memory});

    return graph
}
