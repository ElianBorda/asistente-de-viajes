import { END } from "@langchain/langgraph";
import { State } from "../../graph.js";

/**
 * Determinar el tipo de mensaje recibido
 * @param state Estado global actual
 * @returns siguiente nodo a procesar
 */
export const processClimateEdge = (state: State): "process-date" | "process-numday" | typeof END => {

    switch (state.estimationDate){
        case "Date":
            return "process-date";
        case "Numday":
            return "process-numday";
        default:
            return END
    }
} 
