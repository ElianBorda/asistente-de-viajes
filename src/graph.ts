import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { processDestination, processLuggageAndClimate, processMessage, processOther } from "./nodes.js";
import { processMessageEdge } from "./edges.js";

type MessegeType = 
    | "Destination"
    | "LuggageAndClimate"
    | "Other";

type Message = {
    message: string; 
};

type Destination = {
    userId?: string; 
    description: string; 
}

type LuggageAndClimate = {
    userId?: string;
    recommendation: string;
}

const graphAnotation = Annotation.Root({
    messegeType: Annotation<MessegeType>(),
    message: Annotation<Message>(),
    destination: Annotation<Destination>(),
    luggageAndClimate: Annotation<LuggageAndClimate>()
})

export type State = typeof graphAnotation.State;
export type Update = typeof graphAnotation.Update;

export function createGraph() {
    const workflow = new StateGraph(graphAnotation)
        .addNode("process-message", processMessage)
        .addNode("process-destination", processDestination)
        .addNode("process-luggageandclimate", processLuggageAndClimate)
        .addNode("process-other", processOther)
        .addEdge(START, "process-message")
        .addEdge("process-other", END)
        .addEdge("process-destination", END)
        .addEdge("process-luggageandclimate", END)
        .addConditionalEdges("process-message", processMessageEdge);
    
    const graph = workflow.compile();

    return graph
}