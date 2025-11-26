<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'

// Zoznam európskych krajín (ISO2 + Kosovo, Rusko, Turecko)
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
  // North America
  { code: 'CA', name: 'Canada' },
  { code: 'US', name: 'United States' },
  { code: 'MX', name: 'Mexico' },

  // Central America
  { code: 'BZ', name: 'Belize' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'HN', name: 'Honduras' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'PA', name: 'Panama' },

  // Caribbean
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

  // South America
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

// reaktívne dáta otázky
const newQuestion = reactive({
  country: '',
  questionType: '',
  questionText: '',
  correctAnswer: '',
  wrongA: '',
  wrongB: '',
  wrongC: ''
})

const errors = reactive({
  country: false,
  questionType: false,
  questionText: false,
  correctAnswer: false,
  wrongA: false,
  wrongB: false,
  wrongC: false
})

// ref pre feedback
const saved = ref(false)
const region = ref('europe')

const availableCountries = computed(() => {
  if (region.value === 'americas') return americasCountries
  return europeanCountries
})
// uloženie otázky do zoznamu
async function saveQuestion() {
  let hasError = false

  for (const key in newQuestion) {
    if (!newQuestion[key]) {
      errors[key] = true
      hasError = true
    } else {
      errors[key] = false
    }
  }

  if (hasError) return

  const stored = JSON.parse(localStorage.getItem('customQuestions') || '[]')
  stored.push({ ...newQuestion })
  localStorage.setItem('customQuestions', JSON.stringify(stored))

  // pripravíme objekt vo formáte, ktorý server očakáva
  const payload = {
    id: newQuestion.country,           // stat = id
    player: 1,
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
  console.log('Payload pred fetch:', payload);

  try {
    const res = await fetch('http://localhost:5000/questions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error('Failed to save question to server')

    // feedback
    saved.value = true
    setTimeout(() => { saved.value = false }, 2000)
  } catch (err) {
    console.error(err)
    alert('Chyba pri ukladaní otázky na server')
  }

  // vyčistíme form
  for (const key in newQuestion) newQuestion[key] = ''
  for (const key in errors) errors[key] = false
  localStorage.removeItem('customQuestionDraft')
}


// 🔁 sleduj zmeny vo všetkých poliach a priebežne ukladaj
watch(
  newQuestion,
  (val) => {
    localStorage.setItem('customQuestionDraft', JSON.stringify(val))
  },
  { deep: true }
)

// 🔄 pri načítaní komponentu načítaj predchádzajúci draft
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
    region.value = savedRegion   // 'europe' alebo 'americas'
  }
})
</script>

<template>
  <div class="custom-wrapper-custom">
    <div class="header-custom">
      <router-link to="/themes" class="back-link-custom">
        <h1>← Back</h1>
      </router-link>
    </div>

    <div class="block-custom">
      <h2>Custom Question</h2>

<div class="form-custom">
  <label>Country</label>
  <select v-model="newQuestion.country" :class="{ 'error-custom': errors.country }">
    <option disabled value="">Select a country</option>
    <option v-for="c in availableCountries" :key="c.code" :value="c.code">{{ c.name }}</option>
  </select>

  <label>Question Type</label>
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
  </div>
</template>

<style>
.custom-wrapper-custom {
  position: relative;
  width: 100vw;
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
  z-index: 9999;
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.3s ease;
}


</style>
