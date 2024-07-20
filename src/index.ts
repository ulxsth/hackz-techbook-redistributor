import express, { Application, Request, Response } from 'express'
import { router as authRouter } from './routes/auth'
import cookieParser from 'cookie-parser'

const app: Application = express()
const PORT = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', async (req: Request, res: Response) => {
  const userId = req.cookies.user_id;
  const accessToken = req.cookies.access_token;
  if(userId && accessToken) {
    return res.status(200).send({
      message: `Welcome, ${userId}`,
    })
  }

  return res.status(200).send({
    message: 'Hello World!',
  })
})

app.use('/auth', authRouter);

try {
  app.listen(PORT, () => {
    console.log(`dev server running at: http://localhost:${PORT}/`)
  })
} catch (e) {
  if (e instanceof Error) {
    console.error(e.message)
  }
}
