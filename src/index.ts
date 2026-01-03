import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { connectDatabase } from './database/mongodb';
import { MONGODB_URI, PORT } from './config';
import authRoutes from "./routes/auth.route";

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({ success: "true", message: "Welcome to the API" });
});

async function start(){
    await connectDatabase();

    app.listen(PORT, ()=>{
    console.log(`Server: http://localhost:${PORT}`);
    console.log(MONGODB_URI);
});
}

start().catch((error) => console.log(error));