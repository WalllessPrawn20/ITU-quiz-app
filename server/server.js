import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

const dataPath = path.join(process.cwd(), 'questions.json')
const statsPath = path.join(process.cwd(), 'stats.json')


function loadQuestions() {
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
}

function loadStats() {
  if (!fs.existsSync(statsPath)) return {}
  return JSON.parse(fs.readFileSync(statsPath, 'utf-8'))
}

function saveStats(stats) {
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2))
}


app.get('/questions', (req, res) => {
  const questions = loadQuestions()
  res.json(questions)
})


app.get('/questions/filter', (req, res) => {
  let questions = loadQuestions()
  const { id, category, continent } = req.query

  if (id) questions = questions.filter((q) => q.id === String(id))
  if (category) questions = questions.filter((q) => q.category === category)
  if (continent) questions = questions.filter((q) => q.continent === continent)

  res.json(questions)
})


app.get('/stats', (req, res) => {
  const stats = loadStats()
  res.json(stats)
})


app.post('/stats/update', (req, res) => {
  const { continent, correct } = req.body

  if (!continent) {
    return res.status(400).json({ error: 'Missing continent' })
  }

  const stats = loadStats()

  if (!stats[continent]) stats[continent] = { correct: 0, wrong: 0 }
  if (correct) stats[continent].correct++
  else stats[continent].wrong++

  saveStats(stats)
  res.json(stats[continent])
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
