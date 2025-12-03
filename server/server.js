/************************************/
/* Name: Matej Melchiory            */
/* Date: 3.12.2025                  */
/* Login: xmelchm00                 */
/************************************/

import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'

// Server setup
const app = express()
const PORT = 5000

// In-memory game state
let game = {
  playerScore: 0,
  player_country: [],
  botScore: 0,
  bot_country: [],
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
  completed_turns: 0
}

// Middleware
app.use(cors())
app.use(express.json())

// All file paths
const dataPath = path.join(process.cwd(), 'questions.json')
const statsPath = path.join(process.cwd(), 'stats.json')
const dataPath2 = path.join(process.cwd(), 'questions2.json')

// Load number questions
function loadNumberQuestions() {
  return JSON.parse(fs.readFileSync(dataPath2, 'utf-8'))
}

// Load abcd questions
function loadQuestions() {
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
}

// Load stats from the json
function loadStats() {
  if (!fs.existsSync(statsPath)) return {}
  return JSON.parse(fs.readFileSync(statsPath, 'utf-8'))
}

// Save stats to the json
function saveStats(stats) {
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2))
}

// ======= Endpoints: questions =======
app.get('/questions', (req, res) => {
  const questions = loadQuestions()
  res.json(questions)
})

app.get('/questions2', (req, res) => {
  const questions = loadNumberQuestions()
  res.json(questions)
})

// Filter abcd questions by id and category
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

// Filter number questions by id
app.get('/questions2/filter', (req, res) => {
  let questions = loadNumberQuestions()
  const { id } = req.query

  if (id) questions = questions.filter((q) => q.id === String(id))

  res.json(questions)
})

// Create new user abcd question
app.post('/questions/create', (req, res) => {
  const q = req.body;

  // Validate input
  if (!q.id || !q.category || !q.title || !q.correct || q.answers.length < 4) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const questions = loadQuestions();

  const newFormattedQuestion = {
    id: q.id,                      // SK, IE, CZ...
    player: 1,                          // custom question
    category: q.category,           // History / Society...
    title: q.title,              // main text
    answers: q.answers,
    correct: q.correct
  };

  questions.push(newFormattedQuestion);

  // Save updated questions.json
  fs.writeFileSync(dataPath, JSON.stringify(questions, null, 2));

  res.json({
    success: true,
    message: "Question saved",
    question: newFormattedQuestion
  });
});


// ======= Pomocná funkcia - reset hry =======
// function resetGame() {
//   game.playerScore = 0
//   game.botScore = 0
//   game.completed_turns = 0
//   game.player_country = []
//   game.bot_country = []
//   console.log('🌀 Game reset.')
// }

// // ======= Endpoint: reset skóre ======= TODO
// app.post('/game/reset', (req, res) => {
//   resetGame()
//   res.json({ success: true, message: 'Game reset.' })
// })

// ======= Endpoint: Score =======
app.get('/game/score', (req, res) => {
  res.json({
    playerScore: game.playerScore,
    botScore: game.botScore,
    completed_turns: game.completed_turns,
  })
})

// ======= Endpoints: Answers ======= TODO
app.post('/game/answer2', (req, res) => {
  const { question, playerValue, reactionTime, difficulty } = req.body
  if (!question) return res.status(400).json({ error: "Missing question" })

  const correct = question.correct

  const botSpread = { Easy: 25, Medium: 15, Hard: 8 }
  const spread = botSpread[difficulty] || 15

  const botValue = correct + (Math.random() * spread * 2 - spread)
  const botTime = Math.random() * 1500 + 300

  const playerDist = Math.abs(playerValue - correct)
  const botDist = Math.abs(botValue - correct)

  let playerPoint = 0
  let botPoint = 0

  if (playerDist < botDist) playerPoint = 1
  else if (botDist < playerDist) botPoint = 1
  else {
    if (reactionTime < botTime) playerPoint = 1
    else botPoint = 1
  }

  if (playerPoint) game.playerScore += 1
  if (botPoint) game.botScore += 1
  game.completed_turns += 1

  res.json({
    botValue,
    botTime,
    playerDist,
    botDist,
    playerPoint,
    botPoint
  })
})

app.post('/game/answer', (req, res) => {
  const { question, playerAnswer, difficulty } = req.body
  if (!question) return res.status(400).json({ error: 'Missing question' })

  // Bot accuracy based on difficulty
  const botAccuracy = { Easy: 0.5, Medium: 0.65, Hard: 0.8 }
  const correctAnswer = question.correct

  // Calculate bot answer
  const botAnswer =
    Math.random() < (botAccuracy[difficulty] || 0.65)
      ? correctAnswer
      : question.answers.filter((a) => a !== correctAnswer)[
          Math.floor(Math.random() * (question.answers.length - 1))
        ]

  const playerCorrect = playerAnswer === correctAnswer
  const botCorrect = botAnswer === correctAnswer

  let playerPoint = 0
  let botPoint = 0
  let tie = false
  
  // Determine points
  if (playerCorrect && !botCorrect) {
    playerPoint = 1
    game.playerScore += 1
    game.completed_turns += 1
  }
  else if (!playerCorrect && botCorrect) {
    botPoint = 1
    game.botScore += 1
    game.completed_turns += 1
  }
  else {
    tie = true
  }

  res.json({
    botAnswer,
    playerPoint,
    botPoint,
    playerCorrect,
    botCorrect,
    tie
  })
})

// ======= Endpoint: Game =======
app.post('/game/start', (req, res) => {
  const { continent, categories, difficulty, timer, turns } = req.body

  if (!continent || !categories || !difficulty || !timer || !turns) {
    return res.status(400).json({ error: 'Missing game settings' })
  }

  // Initialize game state
  game.playerScore = 0
  game.botScore = 0
  game.completed_turns = 0
  game.player_country = []
  game.bot_country = []

  game.continent = continent
  game.categories = categories
  game.difficulty = difficulty
  game.timer = timer
  game.turns = turns

  res.json({ success: true })
})

// Load current game state
app.get('/game/load', (req, res) => {
  res.json(game)
})

// Add country id to player or bot list
app.post('/game/country/add', (req, res) => {
  const { target, countryId } = req.body

  // Validate input
  if (!target || !countryId) {
    return res.status(400).json({ error: "Missing target or countryId" })
  }
  if (target !== "player" && target !== "bot") {
    return res.status(400).json({ error: "Invalid target. Use 'player' or 'bot'." })
  }

  // Add country to the respective list if not already present
  let list
  if (target === "player") {
    list = game.player_country
  } else {
    list = game.bot_country
  }

  if (!list.includes(countryId)) {
    list.push(countryId)
  }

  return res.json({
    success: true,
  })
})

// ====== Endpoint: Stats ======
app.get('/stats', (req, res) => {
  const stats = loadStats()
  res.json(stats)
})

// Update stats in ti stats.json
app.post('/stats/update', (req, res) => {
  const { continent, correct } = req.body

  if (!continent) return res.status(400).json({ error: 'Missing continent' })

  // Load, update and save stats
  const stats = loadStats()
  if (!stats[continent]) stats[continent] = { correct: 0, wrong: 0 }

  if (correct) stats[continent].correct++
  else stats[continent].wrong++

  saveStats(stats)
  res.json(stats[continent])
})

// Reset stats for Europe
app.post('/stats/reset', (req, res) => {
  const stats = loadStats()
  stats['Europe'] = { correct: 0, wrong: 0 }
  stats['America'] = { correct: 0, wrong: 0 }
  saveStats(stats)
  res.json({ success: true })
})



// ====== Run ======
app.listen(PORT, () => console.log(`Server running on port ${PORT}\nNEZABUDNI RESETOVAT SERVER`))
