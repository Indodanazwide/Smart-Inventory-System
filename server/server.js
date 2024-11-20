import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import session from 'express-session'
import router from '../routes/router.js'
import db from '../database/db.js'
import dotenv from 'dotenv'

dotenv.config();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const server = express()
const port = process.env.PORT || 3000

server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))
server.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

server.set('view engine', 'ejs')
server.set('views', path.join(__dirname, '../views'))

server.use((req, res, next) => {
    res.locals.user = req.session.user || null
    next()
})

server.use('/', router)

server.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
})