<!----------------------------->
<!-- Author: Lukas Choleva ---->
<!-- Login: xcholel00 --------->
<!-- Date: 8.12.2025 ---------->
<!----------------------------->

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'

//list of countries in selected regions
const europeanCountries = [
  { code: 'AL', name: 'Albania' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AT', name: 'Austria' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'EE', name: 'Estonia' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'GR', name: 'Greece' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IT', name: 'Italy' },
  { code: 'XK', name: 'Kosovo' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MT', name: 'Malta' },
  { code: 'MD', name: 'Moldova' },
  { code: 'MC', name: 'Monaco' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'MK', name: 'North Macedonia' },
  { code: 'NO', name: 'Norway' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russia' },
  { code: 'SM', name: 'San Marino' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'ES', name: 'Spain' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'TR', name: 'Turkiye' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'GB', name: 'United Kingdom' }
]

const americasCountries = [
  { code: 'CA', name: 'Canada' },
  { code: 'US', name: 'United States' },
  { code: 'MX', name: 'Mexico' },
  { code: 'BZ', name: 'Belize' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'HN', name: 'Honduras' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'PA', name: 'Panama' },
  { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BB', name: 'Barbados' },
  { code: 'CU', name: 'Cuba' },
  { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'GD', name: 'Grenada' },
  { code: 'HT', name: 'Haiti' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'KN', name: 'Saint Kitts and Nevis' },
  { code: 'LC', name: 'Saint Lucia' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' },
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'AR', name: 'Argentina' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'GY', name: 'Guyana' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'SR', name: 'Suriname' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'VE', name: 'Venezuela' }
];

//reactive values for drafts
const newQuestion = reactive({
  country: '',
  questionType: '',
  questionText: '',
  correctAnswer: '',
  wrongA: '',
  wrongB: '',
  wrongC: ''
})

// reactive errors, if something is missing or duplicate
const errors = reactive({
  country: false,
  questionType: false,
  questionText: false,
  correctAnswer: false,
  wrongA: false,
  wrongB: false,
  wrongC: false
})

//reference values for feedback
const saved = ref(false)
const region = ref('europe')

//which list to show
const availableCountries = computed(() => {
  if (region.value === 'americas') return americasCountries
  return europeanCountries
})

//saves question to server
async function saveQuestion() {
  let hasError = false

  //validiting (if everything is filled out)
  for (const key in newQuestion) {
    if (!newQuestion[key]) {
      errors[key] = true
      hasError = true
    } else {
      errors[key] = false
    }
  }

  //getting all answers
  const answers = ["correctAnswer", "wrongA", "wrongB", "wrongC"]
  const values = answers.map(key => ({ key, value: newQuestion[key].trim().toLowerCase()
  }))

  //resetting before marking new errors
  answers.forEach(key => {
    if (!errors[key]){
      errors[key] = false
    }
  })

  let duplicate = {} // fields that should be marked red

  values.forEach((item, i) => {
    //looking fort another answer with same value at different i
    values.forEach((item2, j) => {
      if (i !== j && item.value !== '' && item.value === item2.value) {
        duplicate[item.key] = true
        duplicate[item2.key] = true
      }
    })
  })

  // iff duplicates exist, mark only specific ones
  if (Object.keys(duplicate).length > 0) {
    hasError = true
    Object.keys(duplicate).forEach(key => {
      errors[key] = true
    })
  }

  //not everything is filled out
  if (hasError) {
    return
  }

  //saving question (for browser refresh)
  const stored = JSON.parse(localStorage.getItem('customQuestions') || '[]')
  stored.push({ ...newQuestion })
  localStorage.setItem('customQuestions', JSON.stringify(stored))

  //format for saved question
  const save = {
    id: newQuestion.country,
    player: 1, //custom question
    category: newQuestion.questionType,
    title: newQuestion.questionText,
    answers: [
      newQuestion.correctAnswer,
      newQuestion.wrongA,
      newQuestion.wrongB,
      newQuestion.wrongC
    ],
    correct: newQuestion.correctAnswer
  }
  console.log('data for fetch:', save);

  //sending to server, which saves the question to questions.json
  try {
    const resolution = await fetch('http://localhost:5000/questions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(save)
    })

    if (!resolution.ok) throw new Error('Failed to save question to server')

    // feedback
    saved.value = true
    setTimeout(() => { saved.value = false }, 2000)
  } catch (err) {
    console.error(err)
    alert('Error saving question to server.')
  }

  //clearing form
  for (const key in newQuestion) newQuestion[key] = ''
  for (const key in errors) errors[key] = false
  localStorage.removeItem('customQuestionDraft')
}


//watching changes in form nad saving them
watch(
  newQuestion,
  (val) => {
    localStorage.setItem('customQuestionDraft', JSON.stringify(val))
  },
  { deep: true }
)

//if draft exists, it loads it
onMounted(() => {
  const draft = localStorage.getItem('customQuestionDraft')
  if (draft) {
    const parsed = JSON.parse(draft)
    for (const key in newQuestion) {
      if (parsed[key]) newQuestion[key] = parsed[key]
    }
  }

  const savedRegion = localStorage.getItem('region')
  if (savedRegion) {
    region.value = savedRegion
  }

  //lists all custom questions
  loadCustomQuestions()
})

const customQuestions = ref([])

//all custom questions
async function loadCustomQuestions() {
  try {
    const resolution = await fetch('http://localhost:5000/questions')
    const data = await resolution.json()

    //filter where player is 1 (custom questions)
    customQuestions.value = data.filter(question => question.player === 1)
  } catch (err) {
    console.error('Failed loading questions', err)
  }
}

// when saving new question, refresh list
watch(saved, (val) => {
  if (val) loadCustomQuestions()
})

//deletes said question
async function deleteQuestion(question) {
  const resolution = await fetch("http://localhost:5000/questions/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(question)
  });

  if (resolution.ok) {
    await loadCustomQuestions();
  } else {
    const error = await resolution.json().catch(() => null);
    console.error("Delete failed:", error);
    alert("Delete failed:" + (error?.error ?? ""));
  }
}

// utility function that transforms id into country name
function getCountryName(code) {
  const list = [...europeanCountries, ...americasCountries];
  const country = list.find(c => c.code === code);
  return country ? country.name : code; //fallback
}

//function for ,,editing,, custom question
async function editQuestion(question) {
  //first deletes said question
  await deleteQuestion(question)

  //then gives values of that question into form to change some of them
  newQuestion.country = question.id
  newQuestion.questionType = question.category
  newQuestion.questionText = question.title

  newQuestion.correctAnswer = question.correct
  const wrongAnswers = question.answers.filter(a => a !== question.correct)

  newQuestion.wrongA = wrongAnswers[0] || ""
  newQuestion.wrongB = wrongAnswers[1] || ""
  newQuestion.wrongC = wrongAnswers[2] || ""
}

</script>

<template>
  <div class="custom-wrapper-custom">
    <div class="header-custom">
      <router-link to="/themes" class="back-link-custom">
        <h1>Back</h1>
      </router-link>
    </div>

    <div class="block-custom">
      <h2>Custom Question</h2>

      <div class="form-custom">
        <label>Country</label>
        <!-- list of countries -->
        <select v-model="newQuestion.country" :class="{ 'error-custom': errors.country }">
          <option disabled value="">Select a country</option>
          <option v-for="c in availableCountries" :key="c.code" :value="c.code">{{ c.name }}</option>
        </select>

        <label>Question Type</label>
        <!-- categories -->
        <select v-model="newQuestion.questionType" :class="{ 'error-custom': errors.questionType }">
          <option disabled value="">Select a type</option>
          <option value="History">History</option>
          <option value="Society">Society</option>
          <option value="Geography">Geography</option>
          <option value="Sport">Sport</option>
        </select>

        <label>Question</label>
        <input type="text" v-model="newQuestion.questionText" placeholder="Enter question..." :class="{ 'error-custom': errors.questionText }" />

        <label>Correct answer</label>
        <input type="text" v-model="newQuestion.correctAnswer" placeholder="Correct answer..." :class="{ 'error-custom': errors.correctAnswer }" />

        <label>Wrong answers</label>
        <input type="text" v-model="newQuestion.wrongA" placeholder="1." :class="{ 'error-custom': errors.wrongA }" />
        <input type="text" v-model="newQuestion.wrongB" placeholder="2." :class="{ 'error-custom': errors.wrongB }" />
        <input type="text" v-model="newQuestion.wrongC" placeholder="3." :class="{ 'error-custom': errors.wrongC }" />

        <button class="save-btn-custom" @click="saveQuestion">Save Question</button>
        <span v-if="saved" class="saved-text-custom">Saved!</span>

      </div>
    </div>
    <div v-if="customQuestions.length" class="custom-list-wrapper">
    <h2>Your Custom Questions</h2>

    <div class="custom-list">
      <div v-for="question in customQuestions" :key="question.title" class="custom-question-item">
        <div class="custom-question-header">
          <h3>{{ question.title }}</h3>
          <div class="btn-group">
            <button class="edit-btn" @click="editQuestion(question)">Edit</button>
            <button class="delete-btn" @click="deleteQuestion(question)">Delete</button>
          </div>
        </div>

        <p><strong>Country:</strong> {{ getCountryName(question.id) }}</p>
        <p><strong>Type:</strong> {{ question.category }}</p>

        <ul class="answer-list">
          <li
            v-for="a in question.answers"
            :key="a"
            :class="a === question.correct ? 'correct-answer' : 'wrong-answer'"
          >
            {{ a }}
          </li>
        </ul>
      </div>
    </div>
</div>

  </div>
</template>

<style>
.custom-wrapper-custom {
  position: relative;
  width: 99vw;
  height: 100vh;
  color: white;
  font-family: 'Press Start 2P', monospace;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.custom-wrapper-custom::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../assets/home.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  opacity: 0.5;
  z-index: -1;
}

.header-custom {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3vh;
}

.header-custom h1 {
  font-size: 2rem;
  color: white;
  text-decoration: none;
  margin: 0;
}

.back-link-custom {
  align-self: flex-start;
  text-decoration: none;
  color: white;
  transition: transform 0.2s;
}

.back-link-custom:hover {
  transform: scale(1.05);
  color: #ccc;
}
.error-custom {
  border-color: red !important;
  background: rgba(255, 0, 0, 0.1);
}

.block-custom {
  background: rgba(0, 0, 0, 0.7);
  padding: 1rem;
  border-radius: 1vw;
  width: 40vw;
  height:80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  backdrop-filter: blur(0.5vw);
}

.block-custom h2 {
  font-size: 1.2rem;
}

.form-custom {
  width: 100%;
  height:80vh;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: 1rem;
}

input, select {
  background: rgba(255, 255, 255, 0.1);
  border: 0.2vw solid white;
  border-radius: 0.8vw;
  padding: 1rem;
  color: white;
  font-family: inherit;
  font-size: 1rem;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.save-btn-custom {
  background: none;
  border: 0.3vw solid white;
  color: white;
  font-size: 1rem;
  border-radius: 1vw;
  padding: 1rem 2rem;
    font-family: inherit;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.save-btn-custom:hover {
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.2);
}

select option {
  color: black;
}
.saved-text-custom {
  position: fixed;
  top: 0vh;
  left: 0vw;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: limegreen;
  font-weight: bold;
  font-size: 4rem;
  background: rgba(0, 0, 0, 0.5);
  z-i: 9999;
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.3s ease;
}
.custom-list-wrapper {
  width: 40vw;           /* rovnaká šírka ako formulár */
  max-width: 100%;       /* aby sa nezalamovalo na mobile */
  margin-top: 2rem;
  text-align: center;
}

.custom-question-item {
  padding: 1rem;
  border: 2px solid white;
  border-radius: 1rem;
  background: rgba(0,0,0,0.6);
  text-align: left;
  max-width: 100%;
  word-break: break-word;
  overflow-wrap: break-word;
}

.custom-question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
}

.custom-question-header h3 {
  margin: 0;
  color: gold;
  white-space: normal;
  word-break: break-word;
}

.delete-btn {
  flex-shrink: 0;
  white-space: nowrap;
  background: red;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.8rem;
  transition: transform 0.2s, background 0.2s;
}

.delete-btn:hover {
  transform: scale(1.05);
  background: darkred;
}

.custom-question-item p,
.answer-list li {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;
  margin: 0.3rem 0;
}

.answer-list {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
}

.correct-answer {
  color: limegreen;
  font-weight: bold;
}

.wrong-answer {
  color: red;
}

.edit-btn {
  flex-shrink: 0;
  white-space: nowrap;
  background: orange;
  color: black;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.8rem;
  transition: transform 0.2s, background 0.2s;
}

.edit-btn:hover {
  transform: scale(1.05);
  background: rgb(210,140,0);
}
.btn-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex-shrink: 0;
}


</style>
