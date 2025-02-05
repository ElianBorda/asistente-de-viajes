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

type MessegeType = 
    | "Destination"
    | "Luggage"
    | "Climate"
    | "Other";

type EstimationDate = 
    | "Date"
    | "Numday" // numero de dias
    
type Message = {
    message: string; 
};

type Destination = {
    userId?: string; 
    description: string; 
}

type Luggage = {
    userId?: string;
    destination: string;
    durationTravel: string;
    recommendation: string;
}

type Climate = {
    userId?: string;
    location: string;
    lat: number;
    lon: number; 
    date: string;
    info?: string;
}

// const memory = new MemorySaver();

const graphAnotation = Annotation.Root({
    messegeType: Annotation<MessegeType>(),
    message: Annotation<Message>(),
    destination: Annotation<Destination>(),
    luggage: Annotation<Luggage>(),
    climate: Annotation<Climate>(),
    estimationDate: Annotation<EstimationDate>(),
})

export type State = typeof graphAnotation.State;
export type Update = typeof graphAnotation.Update;

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


        .addEdge(START, "process-message")
        .addEdge("process-other", END)
        .addEdge("process-destination", END)
        .addEdge("process-luggage", END)
        .addEdge("process-date", "process-climate-api")
        .addEdge("process-numday", "process-climate-api")
        .addEdge("process-climate-api", END)

        .addConditionalEdges("process-climate", processClimateEdge)
        .addConditionalEdges("process-message", processMessageEdge);
    
    const graph = workflow.compile(
        // { checkpointer: memory}
    );

    return graph
}
// const config = { configurable: { thread_id: "2"}, streamMode: "values" as const }


// const inputMessage = new HumanMessage("hi! I'm bob");

// for await (const event of await app.stream({
//     message: [inputMessage]
// }, config)) {
//     const recentMsg = event.message[event.message.length - 1];
//     console.log(`================================ ${recentMsg.constructor.name} Message (1) =================================`)
//     console.log(recentMsg.content);
// }

