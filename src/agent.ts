// import { HfInference } from '@huggingface/inference';
// import { Annotation, END, MemorySaver, START, StateGraph } from '@langchain/langgraph';
// import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
// import { HuggingFaceInference } from "@langchain/community/llms/hf";
// import dotenv from 'dotenv';
// import { tool } from '@langchain/core/tools';
// import { z } from "zod";
// import { ToolNode } from '@langchain/langgraph/prebuilt';

// dotenv.config();

// const AgentState = Annotation.Root({
//   message: Annotation<BaseMessage[]>({
//     reducer: (x, y) => x.concat(y),
//   })
// })

// const memory = new MemorySaver();

// const weatherTool = tool((_): string => {
//   return "El clima actual en San Francisco es soleado";
// }, {
//   name: "weather",
//   description: "Obtiene el clima actual de una ciudad",
//   schema: z.object({
//     query: z.string()
//   })
// })

// const tools = [weatherTool];
// const toolNode = new ToolNode<typeof AgentState.State>(tools);
// const model = new HuggingFaceInference({model: "bigscience/bloom"});

// const shouldContinue = (state: typeof AgentState.State): "action" | typeof END => {
//   const lastMessage = state.message[state.message.length - 1];
//   if (lastMessage && !(lastMessage as AIMessage).tool_calls?.length){
//     return END
//   }

//   return "action";
// }

// const callModel = async (state: typeof AgentState.State) =>  {
//   const response = await model.invoke(state.message);
//   return { message: [response]}
// }

// const workflow = new StateGraph(AgentState)
//                         .addNode("agent", callModel)
//                         .addNode("action", toolNode)
//                         .addConditionalEdges("agent", shouldContinue)
//                         .addEdge("action", "agent")
//                         .addEdge(START, "agent")

// const app = workflow.compile({
//     checkpointer: memory,
// });

// const config = { configurable: { thread_id: "2"}, streamMode: "values" as const }


// const inputMessage = new HumanMessage("hi! I'm bob");

// for await (const event of await app.stream({
//     message: [inputMessage]
// }, config)) {
//     const recentMsg = event.message[event.message.length - 1];
//     console.log(`================================ ${recentMsg.constructor.name} Message (1) =================================`)
//     console.log(recentMsg.content);
// }

























// // const model = new HuggingFaceInference({model: "bigscience/bloom"});
// // const res = await model.invoke("El clima actual en San Francisco es");
// // console.log({ res });


// // const hf = new HfInference('');

// // async function generateResponse(prompt: string): Promise<string> {
// //   const response = await hf.textGeneration({
// //     model: 'bigscience/bloom', 
// //     inputs: prompt,
// //     parameters: { max_new_tokens: 50 },
// //   });
// //   return response.generated_text;
// // }

// // const agentCheckpointer = new MemorySaver();

// // async function agent(prompt: string, thread_id: string) {
// //   const responseText = await generateResponse(prompt);
// //   return {
// //     messages: [new HumanMessage(responseText)],
// //     configurable: { thread_id },
// //   };
// // }

// // const agentFinalState = await agent('¿Cuál es el clima actual en San Francisco?', '42');
// // console.log(agentFinalState.messages[agentFinalState.messages.length - 1].content); //de esta forma puedo manejar un historial de versiones.

// // const agentNextState = await agent('¿Y en Nueva York?', '42');
// // console.log(agentNextState.messages[agentNextState.messages.length - 1].content);

