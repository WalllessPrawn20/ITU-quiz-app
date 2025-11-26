import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'

const app = express()
const PORT = 5000

let game = {
  playerScore: 0,
  botScore: 0,
  turn: 0,
  continent: "europe",
  categories: {
    History: false,
    Society: false,
    Geography: true,
    Sport: false
  },
  difficulty: "Medium",
  timer: 15,
  turns: 25,
  completed_turns: 0
}

app.use(cors())
app.use(express.json())

// ====== Paths ======
const dataPath = path.join(process.cwd(), 'questions.json')
const statsPath = path.join(process.cwd(), 'stats.json')
const gamePath = path.join(process.cwd(), 'game.json')

// ====== File utils ======
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

// ====== Basic endpoints ======
app.get('/questions', (req, res) => {
  const questions = loadQuestions()
  res.json(questions)
})

app.get('/questions/filter', (req, res) => {
  let questions = loadQuestions()
  const { id, category } = req.query

  if (id) questions = questions.filter((q) => q.id === String(id))

  if (category) {
    const categories = category.split(',').map((c) => c.trim())
    questions = questions.filter((q) => categories.includes(q.category))
  }

  res.json(questions)
})

// ======= Pomocná funkcia - reset hry =======
function resetGame() {
  game.playerScore = 0
  game.botScore = 0
  game.turn = 0
  console.log('🌀 Game reset.')
}

// ======= Endpoint: reset skóre =======
app.post('/game/reset', (req, res) => {
  resetGame()
  res.json({ success: true, message: 'Game reset.' })
})

// ======= Endpoint: zisti skóre =======
app.get('/game/score', (req, res) => {
  res.json({
    playerScore: game.playerScore,
    botScore: game.botScore,
    turn: game.turn,
  })
})

// ======= Endpoint: odpoveď hráča =======
app.post('/game/answer', (req, res) => {
  const { question, playerAnswer, difficulty } = req.body
  if (!question) return res.status(400).json({ error: 'Missing question' })

  // Bot odpoveď
  const botAccuracy = { Easy: 0.5, Medium: 0.65, Hard: 0.8 }
  const correctAnswer = question.correct
  const botAnswer =
    Math.random() < (botAccuracy[difficulty] || 0.65)
      ? correctAnswer
      : question.answers.filter((a) => a !== correctAnswer)[
          Math.floor(Math.random() * (question.answers.length - 1))
        ]

  // Vyhodnotenie hráča
  const playerCorrect = playerAnswer === correctAnswer
  const botCorrect = botAnswer === correctAnswer

  // Body podľa tvojej logiky
  if (playerCorrect && !botCorrect) game.playerScore += 1
  else if (!playerCorrect && botCorrect) game.botScore += 1
  // inak nič sa nepridá
  game.turn += 1

  res.json({
    botAnswer,
    playerPoint: playerCorrect && !botCorrect ? 1 : 0,
    botPoint: !playerCorrect && botCorrect ? 1 : 0,
    playerCorrect,
    botCorrect,
  })
})

// ====== Stats ======
app.get('/stats', (req, res) => {
  const stats = loadStats()
  res.json(stats)
})

app.post('/stats/update', (req, res) => {
  const { continent, correct } = req.body

  if (!continent) return res.status(400).json({ error: 'Missing continent' })

  const stats = loadStats()
  if (!stats[continent]) stats[continent] = { correct: 0, wrong: 0 }

  if (correct) stats[continent].correct++
  else stats[continent].wrong++

  saveStats(stats)
  res.json(stats[continent])
})

// ======= Endpoint: reset statov =======
app.post('/stats/reset', (req, res) => {
  const stats = loadStats()
  stats['Europe'] = { correct: 0, wrong: 0 }
  saveStats(stats)
  res.json({ success: true, message: 'Stats reset for Europe.' })
})


app.post('/game/start', (req, res) => {
  const { continent, categories, difficulty, timer, turns } = req.body

  console.log("Continent:", continent);
  console.log("Categories:", categories);
  console.log("Difficulty:", difficulty);
  console.log("Timer:", timer);
  console.log("Turns:", turns);

  if (!continent || !categories || !difficulty || !timer || !turns) {
    console.log("Chýbajú niektoré nastavenia");
    return res.status(400).json({ error: 'Missing game settings' });
  }

  // Prepis všetkých premenných v game
  game.playerScore = 0
  game.botScore = 0
  game.turn = 0
  game.completed_turns = 0

  game.continent = continent
  game.categories = categories
  game.difficulty = difficulty
  game.timer = timer
  game.turns = turns

  res.json({ success: true })
})

app.get('/game/load', (req, res) => {
  res.json(game)
})

// ====== Run ======
app.listen(PORT, () => console.log(`Server running on port ${PORT}\nNEZABUDNI RESETOVAT SERVER`))
