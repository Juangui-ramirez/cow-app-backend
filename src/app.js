import express from 'express';
import apiRouter from './routes/index.js'

const app = express()
const PORT = 3000

app.use(express.json())

app.use("/api",apiRouter)

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT} 🚀`)
})