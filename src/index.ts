// Asistente de viajes

import { createGraph } from "./graph.js";
import dotenv from 'dotenv';

dotenv.config();


const graph = createGraph()

const res = await graph.invoke({ message: { message: "Alguna sugerencia para mi viaje a la playa?" },})
console.log(res)