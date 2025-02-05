import { END } from "@langchain/langgraph";
import { State } from "../../graph.js";

export const processClimateEdge = (state: State): "process-date" | "process-numday" | typeof END => {

    // console.log("a partir del tipo de mensaje procesado se determino que es: " + state.messegeType)

    switch (state.estimationDate){
        case "Date":
            return "process-date";
        case "Numday":
            return "process-numday";
        default:
            return END
    }
} 
