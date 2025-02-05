import { END } from "@langchain/langgraph";
import { State } from "../../graph.js";

/**
 * Determinar el tipo de mensaje recibido relacionado al tipo de consulta proporcionada.
 * @param state Estado global actual
 * @returns siguiente nodo a procesar
 */ 
export const processMessageEdge = (state: State): "process-destination" | "process-luggage" | "process-climate" | "process-other" | "process-memory" | typeof END => {

    switch (state.messegeType){
        case "Destination":
            return "process-destination";
        case "Luggage":
            return "process-luggage";
        case "Climate":
            return "process-climate";
        case "Memory":
            return "process-memory";
        case "Other":
            return "process-other";
        default:
            return END
    }
} 