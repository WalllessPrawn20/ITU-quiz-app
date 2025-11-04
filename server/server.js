import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'

const app = express()
const PORT = 5000

app.use(cors()) // ak máš frontend na inom porte

const dataPath = path.join(process.cwd(), 'questions.json')

// endpoint pre všetky otázky
app.get('/questions', (req, res) => {
  const questions = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  res.json(questions)
})

// endpoint s filtrami: ?id=1&category=capitals
app.get('/questions/filter', (req, res) => {
  let questions = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  const { id, category } = req.query

  if (id) questions = questions.filter((q) => q.id === String(id))
  if (category) questions = questions.filter((q) => q.category === category)

  res.json(questions)
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
