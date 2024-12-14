import express from 'express'
import './dbConnect.js';
import cors from 'cors'
import userRoute from './routes/userRoutes.js'



const app = express();
const port = 3001;

app.use(express.json());

const corsOptions = {
    origin: ['http://localhost:3000','https://grocery-shop-three.vercel.app/','https://merakirana.himansu.in', '*' ],// Replace with your frontend's origin
    credentials: true, // Allow credentials
    methods: ['OPTIONS','GET', 'POST', 'PUT', 'PATCH', 'DELETE' ],
};
app.use(cors(corsOptions));


app.options('*', cors(corsOptions));

app.use('/api/user', userRoute)


app.get('/',(req,res)=>{
    res.status(200).send("server started up fine")
})
app.listen(port,()=>{
    console.log(`the server starting at port no ${port}`)
})