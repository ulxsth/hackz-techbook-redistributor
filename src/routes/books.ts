import { Router } from "express";
import { createClient } from "../libs/supabase";
export const router = Router();

router.get('/', async (req, res) => {
  const supabase = createClient(req, res)
  const { data, error } = await supabase.from('books').select('*')
  if (error) {
    throw new Error(error.message)
  }

  res.render('books/index', { books: data })
})
