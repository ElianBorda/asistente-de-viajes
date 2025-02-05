import express, { Application, Request, Response } from 'express';
import Joi from 'joi';
import { getResponseBot } from './utils/getResponseBot.js';
import { createGraph } from './graph.js';

const app: Application = express();
const port = process.env.PORT || 3000;


app.use(express.json());
const graph = createGraph()

const schema = Joi.object({
  message: Joi.string().required().messages({
    'any.required': 'El campo mensaje es requerido',
    'string.empty': 'El campo mensaje no puede estar vacío',
    'string.base': 'El campo mensaje debe ser de tipo texto',
  })
})

app.post('/api/chat', (req, res) => {
  // Puedes acceder a los datos enviados en el cuerpo de la solicitud
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.message });
  }

  getResponseBot(graph, value.message).then((response) => {
    res.send(response)
  })
  
});


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});