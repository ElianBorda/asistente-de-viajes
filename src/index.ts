// Asistente de viajes

import { createGraph } from "./graph.js";
import dotenv from 'dotenv';

dotenv.config();


const graph = createGraph()

const res = await graph.invoke({
    message: {
        message: "¿Que ropa deberia llevar a brasil?"
    },
})