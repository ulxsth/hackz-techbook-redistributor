import express, { Application, Request, Response, NextFunction } from 'express'
import { router as authRouter } from './routes/auth'
import { router as booksRouter } from './routes/books'
import cookieParser from 'cookie-parser'
import expressLayouts from 'express-ejs-layouts'
import path from 'path'

const app: Application = express()
const PORT = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(expressLayouts)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../public/views'))

// routers
app.use('/auth', authRouter);
app.use('/books', booksRouter);

// root routes
app.get('/', async (req: Request, res: Response) => {
  const userId = req.cookies.user_id;
  const accessToken = req.cookies.access_token;
  if(userId && accessToken) {
    return res.status(200).render('index')
  }

  return res.status(200).render('index')
})

app.use((req, res, next) => {
  const err = new Error('Not Found')
  next(err)
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.render('error', {err})
})

try {
  app.listen(PORT, () => {
    console.log(`dev server running at: http://localhost:${PORT}/`)
  })
} catch (e) {
  if (e instanceof Error) {
    console.error(e.message)
  }
}
