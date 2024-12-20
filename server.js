import express from 'express'
import { configDotenv } from 'dotenv'
import path from 'path';
import { fileURLToPath } from 'url';
import { verifySubDomain } from './app/middleware/verifyDomain.js';
import setRouter from './router.js';
import { getBreadCrumbs } from './app/middleware/getBreadcrumbs.js';
import http from "http"
import redisClient from './app/config/redis.js';
import { RedisStore } from 'connect-redis';
import session from 'express-session';
import { Server } from 'socket.io';
import { DashboardHandler } from './app/controllers/student/socket/dashboard.js';
import { DemandEstimationHandler } from './app/controllers/student/socket/demandEstimation.js';

configDotenv()

const app = express()
const PORT = process.env.PORT

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));
app.use(express.static('public'));

app.use(
    session(({
        store : new RedisStore({client : redisClient}),
        secret : process.env.SESSION_SECRET || 'seceret-key', 
        resave : false,
        saveUninitialized : false,
        cookie : {
            secure : false, 
            maxAge : 24 * 60 * 60 * 1000
        }
    }))
)

app.use(verifySubDomain)
app.use(getBreadCrumbs)

app.use((req,res,next)=>{
    req.sidebarActive = req.originalUrl
    next()
})


setRouter(app)

// app.use('/student', dashboardRoutes)

// app.get('/', async(req,res) => {
//     res.render('students/dashboard/index')   
// })




// app.listen(PORT,()=>{
//     console.log(`server is running on ${PORT}`)
//     console.log(`server is running on http://sbm-mum.localhost:${PORT}`)
// })


const server = http.createServer(app)
const io = new Server(server)

io.on("connection", (socket) => {
    DashboardHandler(socket, io)
    DemandEstimationHandler(socket, io)
})


server.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`)
    console.log(`server is running on http://sbm-mum.localhost:${PORT}`)
})
