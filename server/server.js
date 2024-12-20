import express from 'express'
import './dbConnect.js';
import cors from 'cors'
import userRoute from './routes/userRoutes.js'
import taskRoute from './routes/taskRoutes.js'


const app = express();
const port = 8080;

app.use(express.json());

const corsOptions = {
    origin: ['http://localhost:3000','http://localhost:3001','https://todo.himansu.in','https://task-controller-himansus-projects-4e5fe489.vercel.app/', '*' ],// Replace with your frontend's origin
    credentials: true, // Allow credentials
    methods: ['OPTIONS','GET', 'POST', 'PUT', 'PATCH', 'DELETE' ],
};
app.use(cors(corsOptions));


app.options('*', cors(corsOptions));

app.use('/api/user', userRoute)
app.use('/api/task', taskRoute)

app.get('/',(req,res)=>{
    res.status(200).send("server started up fine")
})
app.listen(port,()=>{
    console.log(`the server starting at port no ${port}`)
})