import { END } from "@langchain/langgraph";
import { State } from "./graph.js";

export const processMessageEdge = (state: State): "process-destination" | "process-luggageandclimate" | "process-other" | typeof END => {

    // console.log("a partir del tipo de mensaje procesado se determino que es: " + state.messegeType)


    switch (state.messegeType){
        case "Destination":
            return "process-destination";
        case "LuggageAndClimate":
            return "process-luggageandclimate";
        case "Other":
            return "process-other";
        default:
            return END
    }
} 