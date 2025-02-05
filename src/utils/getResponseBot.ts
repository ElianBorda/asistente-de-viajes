import { HumanMessage } from "@langchain/core/messages";

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