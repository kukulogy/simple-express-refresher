import express, { Request, Response, Application } from 'express';
import orderRoutes from "./routes/order.routes";
const app = express();

app.use(express.json());

const PORT: number = 3000;

app.use('/orders/', orderRoutes)
app.get('/', (req: Request, res: Response) => res.send('Hello World'));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
