import { HumanMessage } from "@langchain/core/messages";


/**
 * Dado un grafo y un mensaje de usuario, devuelve la respuesta del bot. El hilo de la conversación es opcional.
 * @param graph Grafo de la conversación
 * @param userInput Mensaje del usuario
 * @param thread_id Identificador del hilo de la conversación
 * @returns Respuesta del bot
 */
export const getResponseBot = async (graph: any, userInput: string, thread_id: string = "thread_1") => {
    const input = new HumanMessage(userInput)
    const configMemory = { configurable: { thread_id: thread_id} }
    const res = await graph.stream({ message: [ input ] }, { ...configMemory, streamMode: "values",
        })

    let finalEvent;
    for await (const event of res) {
        finalEvent = event
    }
    return finalEvent.message[finalEvent.message.length - 1].content;
}