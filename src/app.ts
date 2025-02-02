import express, { Application, Request, Response } from 'express';

const app: Application = express();
const port = process.env.PORT || 3000;


app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.send('¡Hola TypeScript con Express!');
});


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});