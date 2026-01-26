import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { connectDatabase } from './database/mongodb';
import { MONGODB_URI, PORT } from './config';
import authRoutes from "./routes/auth.route";
import adminRoutes from "./routes/admin/admin.routes";
import cors from 'cors';
import path from 'path';

const app: Application = express();
const corsOptions = {
    origing : ['http://localhost: 3000', 'http://localhost:3003', 'http://localhost:3005',
        'http://192.168.18.4:5050',   // Flutter running via IP (Mobile/Web)
        'http://127.0.0.1:5050'
    ], 
    optionsSuccessStatus : 200, 
    credentials  : true
};
app.use(cors(corsOptions));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/profile_pictures', express.static(path.join(process.cwd(), 'public', 'profile_pictures')));
app.use(express.static(path.join(process.cwd(), 'public', 'profile_pictures')));
app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({ success: "true", message: "Welcome to the API" });
});

async function start(){
    await connectDatabase();

    app.listen(PORT, ()=>{
    console.log(`Server: http://localhost:${PORT}`);
    console.log(MONGODB_URI);
    }); // added closing brace here
}

start().catch((error) => console.log(error));