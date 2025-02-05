import { END } from "@langchain/langgraph";
import { State } from "../../graph.js";

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