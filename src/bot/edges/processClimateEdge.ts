import { END } from "@langchain/langgraph";
import { State } from "../../graph.js";

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
