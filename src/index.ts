// Asistente de viajes

import { Annotation, START, END,  StateGraph } from "@langchain/langgraph";

type MessegeType = 
    | "Destination"
    | "Luggage"
    | "Climate"
    | "Other";

type Message = {
    message: string; 
};

type Destination = {
    userId?: string; 
    place: string; 
    description: string; 
}

type Climate = {
    userId?: string;
    text: string; 
    degree: string;
    canTravel: boolean;  
}

type Luggage = {
    userId?: string;
    recommendation: {
        appropriateSuitcase: string; 
        appropriateClothing: string; 
        appropriateFootwear: string; 
    };
}

const graphAnotation = Annotation.Root({
    messegeType: Annotation<MessegeType>(),
    messege: Annotation<Message>(),
    destination: Annotation<Destination>(),
    climate: Annotation<Climate>(),
    luggage: Annotation<Luggage>()
})

type State = typeof graphAnotation.State;
type Update = typeof graphAnotation.Update;


const processMessage = async (state: State): Promise<Update> => {
    //TODO esta funcion decide que tipo de mensaje es.

    console.log("procesa el mensaje para decidir el tipo")
    
    return {
        messegeType: "Destination"
    }
}

const processClimate = async (state: State): Promise<Update> => {
    //TODO esta funcion retorna informacion sobre el clima

    console.log("Entramos en el nodo de clima")

    return {
        climate: {
            userId: "2",
            text: "esta lindo", 
            degree: "26°C",
            canTravel: true 
        }
    }
}

const processDestination = async (state: State): Promise<Update> => {
    //TODO esta funcion retorna informacion sobre el destino.

    console.log("Entramos en el nodo de destino")
    return {
        destination: {
            userId: "2",
            place: "Argentina",
            description: state.messege.message,
        }
    }
}

const processLuggage = async (state: State): Promise<Update> => {
    //TODO esta funcion retorna informacion sobre el equipaje
    console.log("Entramos en el nodo de equipaje")
    return {
        luggage: {
            userId: "2",
            recommendation: {
                appropriateClothing: "Ropa comoda",
                appropriateSuitcase: "Mochila liviana",
                appropriateFootwear: "Calzado comodo"
            }
        },
    }
}

const processOther = async (state: State): Promise<Update> => {
    //TODO esta funcion informa que no es su trabajo responder dicha consulta
    console.log("Entramos en el nodo de otros")
    return {}
}

const processMessageEdge = (state: State): "process-destination" | "process-luggage" | "process-other" | "process-climate" | typeof END => {

    console.log("a partir del tipo de mensaje procesado se determino que es: " + state.messegeType)


    switch (state.messegeType){
        case "Destination":
            return "process-destination";
        case "Luggage":
            return "process-luggage";
        case "Climate": 
            return "process-climate";
        case "Other":
            return "process-other";
        default:
            return END
    }
} 


const workflow = new StateGraph(graphAnotation)
    .addNode("process-message", processMessage)
    .addNode("process-destination", processDestination)
    .addNode("process-luggage", processLuggage)
    .addNode("process-other", processOther)
    .addNode("process-climate", processClimate)
    .addEdge(START, "process-message")
    .addEdge("process-other", END)
    .addEdge("process-destination", END)
    .addEdge("process-luggage", END)
    .addEdge("process-climate", END)
    .addConditionalEdges("process-message", processMessageEdge);

const graph = workflow.compile();

const res = await graph.invoke({
    messege: {
        message: "Hey ¿Argentina es un buen lugar para viajar?"
    },
})