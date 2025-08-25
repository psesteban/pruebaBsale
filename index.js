import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import router from './src/routes/model.routes.js';

dotenv.config()
const PORT = process.env.PORT ?? 3000

const app = express()
app.use(cors())
app.use(express.json())
app.use('/', router)
app.listen(PORT, () => {
  console.log(`Server corriendo en el port ${PORT}`)
})

export default app