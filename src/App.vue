<template>
  <el-container>
    <el-main>
      <el-card
        class="box-card"
        v-loading="isScoring"
        :element-loading-text="scoringProgressText"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
      >
        <template #header>
          <div class="card-header">
            <span>Java 知识能力测试</span>
          </div>
        </template>

        <div v-if="!quizStarted">
          <h1>Java 知识测试</h1>
          <p>共 {{ totalPages }} 套试卷，每套10题。准备好开始了吗？</p>
          <el-button type="primary" @click="startQuiz">开始答题</el-button>
        </div>

        <div v-if="quizStarted && !quizSubmitted">
          <div class="quiz-header">
            <span>试卷 {{ currentPage + 1 }} / {{ totalPages }}</span>
            <span>时间剩余: {{ formattedTime }}</span>
            <span>{{ currentQuestionIndexInPage + 1 }} / {{ currentQuestions.length }}</span>
          </div>
          <el-progress :percentage="progress" :stroke-width="10" striped />
          
          <el-card class="question-card">
            <h3>{{ currentQuestion.question }}</h3>
            <p v-if="currentQuestion.type === 'multiple'" class="multiple-choice-indicator">(多选题)</p>
            
            <el-radio-group v-if="currentQuestion.type === 'single'" v-model="userAnswers[globalCurrentQuestionIndex]" class="options-group">
              <el-radio v-for="(option, index) in currentQuestion.options" :key="index" :label="option" size="large" border>{{ option }}</el-radio>
            </el-radio-group>

            <el-checkbox-group v-if="currentQuestion.type === 'multiple'" v-model="userAnswers[globalCurrentQuestionIndex]" class="options-group">
              <el-checkbox v-for="(option, index) in currentQuestion.options" :key="index" :label="option" size="large" border>{{ option }}</el-checkbox>
            </el-checkbox-group>

            <el-radio-group v-if="currentQuestion.type === 'true_false'" v-model="userAnswers[globalCurrentQuestionIndex]" class="options-group">
              <el-radio label="true" size="large" border>正确</el-radio>
              <el-radio label="false" size="large" border>错误</el-radio>
            </el-radio-group>

            <el-input
              v-if="currentQuestion.type === 'short_answer'"
              v-model="userAnswers[globalCurrentQuestionIndex]"
              type="textarea"
              :rows="4"
              placeholder="请输入你的答案"
            />

            <el-input
              v-if="currentQuestion.type === 'code'"
              v-model="userAnswers[globalCurrentQuestionIndex]"
              type="textarea"
              :rows="6"
              placeholder="请在此处编写代码"
              class="code-input"
            />
          </el-card>

          <div class="navigation-buttons">
            <el-button @click="prevQuestion" :disabled="currentQuestionIndexInPage === 0">上一题</el-button>
            <el-button @click="nextQuestion" :disabled="currentQuestionIndexInPage === currentQuestions.length - 1">下一题</el-button>
            <el-button type="success" @click="submitQuiz">交卷</el-button>
          </div>
        </div>

        <div v-if="quizSubmitted">
          <div v-if="!showReview">
            <h1>试卷 {{ currentPage + 1 }} 完成!</h1>
            <h2>本卷得分: <span :class="pageScore >= 15 ? 'score-pass' : 'score-fail'">{{ pageScore }}</span> / 25</h2>
            <h2>累计总分: {{ totalScore }} / 100</h2>
            
            <div class="page-navigation-buttons">
                <el-button type="primary" @click="reviewAnswers">查看本卷解析</el-button>
                <el-button v-if="currentPage < totalPages - 1" type="success" @click="nextPage">下一张卷子</el-button>
                <el-button v-else type="info" @click="reviewAllAnswers">查看总回顾</el-button>
            </div>
          </div>
          
          <div v-if="showReview">
            <h1>{{ reviewIsAll ? '总回顾' : `试卷 ${currentPage + 1} 解析` }}</h1>
            <el-button @click="backToResults">返回结果页</el-button>
            <el-collapse v-model="activeCollapse" class="review-collapse">
              <el-collapse-item v-for="(question, index) in reviewQuestions" :key="question.id" :name="question.id">
                <template #title>
                  <span :class="isCorrect(getGlobalIndex(index)) ? 'correct-title' : 'wrong-title'">
                    {{ getGlobalIndex(index) + 1 }}. {{ question.question }}
                  </span>
                </template>
                <p>你的答案: {{ formatUserAnswer(userAnswers[getGlobalIndex(index)]) }}</p>
                <p>正确答案: {{ Array.isArray(question.answer) ? question.answer.join(', ') : question.answer }}</p>
                <p><strong>解析:</strong> {{ question.explanation }}</p>
                <div v-if="aiFeedback[question.id]" class="ai-feedback">
                  <p><strong>AI 评语:</strong> {{ aiFeedback[question.id].feedback }}</p>
                  <p><strong>AI 评分:</strong> {{ aiFeedback[question.id].score }} / {{ question.score }}</p>
                </div>
              </el-collapse-item>
            </el-collapse>
            <el-button @click="backToResults" style="margin-top: 20px;">返回结果页</el-button>
          </div>
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { questions as allQuestions } from './questions.js';
import { judgeAnswer } from './aiService.js';

const questions = ref(allQuestions);
const aiFeedback = ref({});
const isScoring = ref(false);
const scoringProgressText = ref('');
const quizStarted = ref(false);
const quizSubmitted = ref(false);
const currentPage = ref(0);
const questionsPerPage = 10;
const currentQuestionIndexInPage = ref(0);
const userAnswers = ref([]);
const totalScore = ref(0);
const pageScore = ref(0);
const timeLeft = ref(1800); // 30 minutes per page
let timer;

const showReview = ref(false);
const reviewIsAll = ref(false);
const activeCollapse = ref([]);

const totalPages = computed(() => Math.ceil(questions.value.length / questionsPerPage));

const currentQuestions = computed(() => {
  const start = currentPage.value * questionsPerPage;
  const end = start + questionsPerPage;
  return questions.value.slice(start, end);
});

const globalCurrentQuestionIndex = computed(() => currentPage.value * questionsPerPage + currentQuestionIndexInPage.value);
const currentQuestion = computed(() => questions.value[globalCurrentQuestionIndex.value]);

const progress = computed(() => {
  return ((currentQuestionIndexInPage.value + 1) / currentQuestions.value.length) * 100;
});

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

const reviewQuestions = computed(() => {
    if (reviewIsAll.value) {
        return questions.value;
    }
    return currentQuestions.value;
});

function getGlobalIndex(reviewIndex) {
    if (reviewIsAll.value) {
        return reviewIndex;
    }
    return currentPage.value * questionsPerPage + reviewIndex;
}

function isCorrect(globalIndex) {
  const question = questions.value[globalIndex];
  const userAnswer = userAnswers.value[globalIndex];
  
  if (userAnswer === null || userAnswer === undefined || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
    return false;
  }

  switch (question.type) {
    case 'single':
      return userAnswer === question.answer;
    case 'multiple':
      if (Array.isArray(userAnswer) && Array.isArray(question.answer)) {
        const sortedUserAnswer = [...userAnswer].sort();
        const sortedCorrectAnswer = [...question.answer].sort();
        return JSON.stringify(sortedUserAnswer) === JSON.stringify(sortedCorrectAnswer);
      }
      return false;
    case 'true_false':
      return userAnswer === question.answer;
    case 'short_answer':
    case 'code':
      // 简答和代码题不自动评分，但只要回答了就认为尝试过
      return userAnswer.trim().length > 0;
    default:
      return false;
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startQuiz() {
  shuffleArray(questions.value);
  quizStarted.value = true;
  userAnswers.value = questions.value.map(q => (q.type === 'multiple' ? [] : null));
  startTimer();
}

function startTimer() {
  clearInterval(timer);
  timeLeft.value = 1800;
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      submitQuiz();
    }
  }, 1000);
}

function prevQuestion() {
  if (currentQuestionIndexInPage.value > 0) {
    currentQuestionIndexInPage.value--;
  }
}

function nextQuestion() {
  if (currentQuestionIndexInPage.value < currentQuestions.value.length - 1) {
    currentQuestionIndexInPage.value++;
  }
}

async function submitQuiz() {
  clearInterval(timer);
  isScoring.value = true;

  const questionsToJudge = [];
  for (let i = 0; i < questions.value.length; i++) {
    const question = questions.value[i];
    if ((question.type === 'short_answer' || question.type === 'code') && userAnswers.value[i] && userAnswers.value[i].trim()) {
      questionsToJudge.push({ question, userAnswer: userAnswers.value[i] });
    }
  }

  // Process AI judging sequentially to avoid hitting rate limits
  for (let i = 0; i < questionsToJudge.length; i++) {
    const item = questionsToJudge[i];
    scoringProgressText.value = `AI 正在评分第 ${i + 1} / ${questionsToJudge.length} 题...`;
    const result = await judgeAnswer(item.question, item.question.answer, item.userAnswer);
    aiFeedback.value[item.question.id] = result;
  }
  
  scoringProgressText.value = '计算最终得分...';
  await new Promise(resolve => setTimeout(resolve, 500)); // Short delay for final text
  
  isScoring.value = false;
  calculatePageScore();
  quizSubmitted.value = true;
}

function calculatePageScore() {
  let score = 0;
  const start = currentPage.value * questionsPerPage;
  const end = start + questionsPerPage;

  for (let i = start; i < end && i < questions.value.length; i++) {
    const question = questions.value[i];
    if (aiFeedback.value[question.id]) {
      score += aiFeedback.value[question.id].score;
    } else if (isCorrect(i)) {
      score += question.score;
    }
  }
  pageScore.value = score;
  // We call calculateTotalScore here to ensure it's updated after page score
  calculateTotalScore();
}

function calculateTotalScore() {
  let score = 0;
  for (let i = 0; i < questions.value.length; i++) {
    const question = questions.value[i];
    if (aiFeedback.value[question.id]) {
      score += aiFeedback.value[question.id].score;
    } else if (isCorrect(i)) {
      score += question.score;
    }
  }
  totalScore.value = score;
}

function reviewAnswers() {
  reviewIsAll.value = false;
  showReview.value = true;
  activeCollapse.value = currentQuestions.value
    .filter((q, i) => !isCorrect(currentPage.value * questionsPerPage + i))
    .map(q => q.id);
}

function reviewAllAnswers() {
    reviewIsAll.value = true;
    showReview.value = true;
    activeCollapse.value = questions.value
        .filter((q, i) => !isCorrect(i))
        .map(q => q.id);
}

function backToResults() {
  showReview.value = false;
}

function nextPage() {
    if (currentPage.value < totalPages.value - 1) {
        currentPage.value++;
        currentQuestionIndexInPage.value = 0;
        quizSubmitted.value = false;
        startTimer();
    }
}

function formatUserAnswer(answer) {
    if (answer === null || answer === undefined) return '未作答';
    if (Array.isArray(answer)) {
        return answer.length > 0 ? answer.join(', ') : '未作答';
    }
    return answer;
}

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style>
.box-card {
  max-width: 800px;
  margin: 20px auto;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}
.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 1.1em;
}
.question-card {
  margin: 20px 0;
}
.multiple-choice-indicator {
  color: #E6A23C;
  font-style: italic;
  margin-bottom: 15px;
}
.options-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.el-radio, .el-checkbox {
  margin: 10px 0;
  width: 100%;
}
.navigation-buttons, .page-navigation-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
}
.score-pass {
  color: #67C23A;
}
.score-fail {
  color: #F56C6C;
}
.wrong-answers {
  margin-top: 20px;
}
.wrong-answer-alert {
  margin-bottom: 15px;
  text-align: left;
}
.wrong-option {
  color: #c0392b;
  font-weight: bold;
}
.correct-option {
  color: #27ae60;
  font-weight: bold;
}
.review-collapse {
  margin-top: 20px;
}
.correct-title {
  color: #67C23A;
}
.wrong-title {
  color: #F56C6C;
}
.ai-feedback {
  margin-top: 15px;
  padding: 10px;
  background-color: #f0f8ff;
  border-left: 4px solid #409EFF;
  border-radius: 4px;
}
.code-input textarea {
  font-family: 'Courier New', Courier, monospace;
  background-color: #f4f4f4;
  color: #333;
}

@media (max-width: 768px) {
  .box-card {
    margin: 10px;
    padding: 5px;
  }

  h1 {
    font-size: 1.5em;
  }

  h2 {
    font-size: 1.2em;
  }

  .quiz-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    font-size: 1em;
  }

  .navigation-buttons, .page-navigation-buttons {
    flex-direction: column;
    gap: 10px;
  }

  .navigation-buttons .el-button, .page-navigation-buttons .el-button {
    width: 100%;
    margin-left: 0 !important;
  }

  .el-radio, .el-checkbox {
    height: auto;
    padding: 10px;
    white-space: normal;
  }

  .el-radio .el-radio__label, .el-checkbox .el-checkbox__label {
    white-space: normal;
    word-break: break-all;
  }

  .el-collapse-item__header {
    white-space: normal;
    word-break: break-word;
    height: auto;
    line-height: 1.5;
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
</style>
