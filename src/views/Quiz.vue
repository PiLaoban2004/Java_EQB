<template>
  <el-card
    class="box-card"
    v-loading="isScoring"
    element-loading-text="AI 正在为主观题评分..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
  >
    <template #header>
      <div class="card-header">
        <span>{{ quizTitle }}</span>
      </div>
    </template>

    <div v-if="!quizStarted">
      <h1>{{ quizTitle }}</h1>
      <p>{{ quizDescription }}</p>
      <p>准备好开始了吗？</p>
      <el-button type="primary" @click="startQuiz">开始答题</el-button>
    </div>

    <div v-if="quizStarted && !quizSubmitted">
      <div class="quiz-header">
        <span>题目 {{ currentQuestionIndex + 1 }} / {{ testPaper.length }}</span>
        <span>时间剩余: {{ formattedTime }}</span>
      </div>
      <el-progress :percentage="progress" :stroke-width="10" striped />
      
      <el-card class="question-card" v-if="currentQuestion">
        <h3>{{ currentQuestion.question }} ({{ currentQuestion.score }}分)</h3>
        <pre v-if="currentQuestion.code_prompt" class="code-prompt">{{ currentQuestion.code_prompt }}</pre>
        <p v-if="currentQuestion.type === 'multiple'" class="multiple-choice-indicator">(多选题)</p>
        
        <el-radio-group v-if="currentQuestion.type === 'single'" v-model="userAnswers[currentQuestion.id]" class="options-group">
          <el-radio v-for="(option, index) in currentQuestion.options" :key="index" :label="option" size="large" border>{{ option }}</el-radio>
        </el-radio-group>

        <el-checkbox-group v-if="currentQuestion.type === 'multiple'" v-model="userAnswers[currentQuestion.id]" class="options-group">
          <el-checkbox v-for="(option, index) in currentQuestion.options" :key="index" :label="option" size="large" border>{{ option }}</el-checkbox>
        </el-checkbox-group>

        <el-input
          v-if="currentQuestion.type === 'short_answer'"
          v-model="userAnswers[currentQuestion.id]"
          type="textarea"
          :rows="4"
          placeholder="请输入你的答案"
        />

        <el-input
          v-if="currentQuestion.type === 'code'"
          v-model="userAnswers[currentQuestion.id]"
          type="textarea"
          :rows="6"
          placeholder="请在此处编写代码"
          class="code-input"
        />
        <div class="question-actions">
          <el-button type="danger" plain size="small" @click="killQuestion(currentQuestion.id)">斩 (永久删除)</el-button>
        </div>
      </el-card>

      <div class="navigation-buttons">
        <el-button @click="prevQuestion" :disabled="currentQuestionIndex === 0">上一题</el-button>
        <el-button @click="nextQuestion" :disabled="currentQuestionIndex === testPaper.length - 1">下一题</el-button>
        <el-button v-if="currentQuestionIndex === testPaper.length - 1" type="success" @click="submitQuiz">交卷</el-button>
      </div>
    </div>

    <div v-if="quizSubmitted">
      <div v-if="!showReview">
        <h1>测试完成!</h1>
        <h2>总分: <span :class="totalScore >= 60 ? 'score-pass' : 'score-fail'">{{ totalScore }}</span> / 100</h2>
        <h2>评级: <span class="grade">{{ finalGrade }}</span></h2>
        
        <div class="page-navigation-buttons">
            <el-button type="primary" @click="reviewAnswers">查看解析</el-button>
            <el-button type="success" @click="startQuiz">再做一套</el-button>
        </div>
      </div>
      
      <div v-if="showReview">
        <h1>试卷回顾与解析</h1>
        <el-button @click="backToResults">返回结果页</el-button>
        <el-collapse v-model="activeCollapse" class="review-collapse">
          <el-collapse-item v-for="(question, index) in testPaper" :key="question.id" :name="question.id">
            <template #title>
              <span :class="isCorrect(question) ? 'correct-title' : 'wrong-title'">
                {{ index + 1 }}. {{ question.question }}
              </span>
            </template>

            <div v-if="question.type === 'single' || question.type === 'multiple'" class="review-options-container">
              <div v-for="option in question.options" :key="option" :class="getOptionClass(question, option)">
                {{ option }}
              </div>
            </div>
            <div v-else>
              <p><strong>你的答案:</strong></p>
              <div class="review-option user-selection">{{ formatUserAnswer(userAnswers[question.id]) }}</div>
              <p style="margin-top: 10px;"><strong>参考答案:</strong></p>
              <div class="review-option correct-answer">{{ Array.isArray(question.answer) ? question.answer.join(', ') : question.answer }}</div>
            </div>

            <p style="margin-top: 15px;"><strong>解析:</strong> {{ question.explanation }}</p>
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
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getGrade } from '../questions.js';
import { getQuestions, deleteQuestion } from '../services/questionService.js';
import { judgeAnswer } from '../aiService.js';
import { addWrongQuestion } from '../services/wrongBookService.js';
import { saveQuizState, loadQuizState, clearQuizState } from '../services/quizStateService.js';
import { ElMessage, ElMessageBox } from 'element-plus';

const props = defineProps({
  type: String
});

const testPaper = ref([]);
const aiFeedback = ref({});
const isScoring = ref(false);
const quizStarted = ref(false);
const quizSubmitted = ref(false);
const currentQuestionIndex = ref(0);
const userAnswers = ref({});
const totalScore = ref(0);
const finalGrade = ref('');
const timeLeft = ref(1800); // 30 minutes
let timer;

const showReview = ref(false);
const activeCollapse = ref([]);

const route = useRoute();
const quizType = computed(() => props.type || 'comprehensive');

const quizTitle = computed(() => {
  return quizType.value === 'special' ? '专项练习' : 'Java 综合能力测试';
});

const quizDescription = computed(() => {
  if (quizType.value === 'special') {
    return '本试卷包含单选题和多选题，专注于特定知识点。';
  }
  return '本试卷共10题，包含单选、多选、简答和代码题。';
});

onMounted(() => {
  const savedState = loadQuizState();
  if (savedState && !props.type) { // Only load saved state if not starting a specific quiz type
    testPaper.value = savedState.testPaper;
    userAnswers.value = savedState.userAnswers;
    totalScore.value = savedState.totalScore;
    finalGrade.value = savedState.finalGrade;
    aiFeedback.value = savedState.aiFeedback;
    quizStarted.value = true;
    quizSubmitted.value = true;
  } else if (props.type) {
    startQuiz();
  }
});

const currentQuestion = computed(() => testPaper.value[currentQuestionIndex.value]);

const progress = computed(() => {
  if (!testPaper.value.length) return 0;
  return ((currentQuestionIndex.value + 1) / testPaper.value.length) * 100;
});

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

function isCorrect(question) {
  const userAnswer = userAnswers.value[question.id];
  
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
    case 'short_answer':
    case 'code':
      return aiFeedback.value[question.id] && aiFeedback.value[question.id].score > 0;
    default:
      return false;
  }
}

async function startQuiz() {
  clearQuizState();
  const currentQuestions = await getQuestions();
  testPaper.value = generateTestPaperFrom(currentQuestions, quizType.value);

  if (testPaper.value.length === 0) {
    ElMessage.error("无法生成试卷，可能是题库为空或题型不足。");
    return;
  }
  
  if (testPaper.value.length < 10 && quizType.value === 'comprehensive') {
    ElMessage.warning("题库题目不足，无法生成完整试卷！");
  }

  userAnswers.value = testPaper.value.reduce((acc, q) => {
    acc[q.id] = q.type === 'multiple' ? [] : '';
    return acc;
  }, {});
  
  currentQuestionIndex.value = 0;
  quizStarted.value = true;
  quizSubmitted.value = false;
  showReview.value = false;
  totalScore.value = 0;
  finalGrade.value = '';
  aiFeedback.value = {};

  startTimer();
}

function generateTestPaperFrom(questions, type = 'comprehensive') {
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const selectRandomQuestions = (qType, count) => {
    const filtered = questions.filter(q => q.type === qType);
    return shuffleArray([...filtered]).slice(0, count);
  };

  if (type === 'special') {
    const singleChoice = selectRandomQuestions('single', 5).map(q => ({ ...q, score: 10 }));
    const multipleChoice = selectRandomQuestions('multiple', 5).map(q => ({ ...q, score: 10 }));
    const trueFalse = selectRandomQuestions('true_false', 2).map(q => ({ ...q, score: 10 }));
    const paper = [...singleChoice, ...multipleChoice, ...trueFalse];
    return shuffleArray(paper);
  } else { // comprehensive
    const singleChoice = selectRandomQuestions('single', 4).map(q => ({ ...q, score: 5 }));
    const multipleChoice = selectRandomQuestions('multiple', 3).map(q => ({ ...q, score: 10 }));
    const shortAnswer = selectRandomQuestions('short_answer', 2).map(q => ({ ...q, score: 15 }));
    const codeQuestion = selectRandomQuestions('code', 1).map(q => ({ ...q, score: 20 }));
    const paper = [...singleChoice, ...multipleChoice, ...shortAnswer, ...codeQuestion];
    return shuffleArray(paper);
  }
}

function killQuestion(questionId) {
  ElMessageBox.confirm(
    '确定要永久删除这道题吗？此操作不可恢复。',
    '斩题确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    const result = await deleteQuestion(questionId);
    if (result.success) {
      // Remove from current test paper
      const index = testPaper.value.findIndex(q => q.id === questionId);
      if (index !== -1) {
        testPaper.value.splice(index, 1);
        if (currentQuestionIndex.value >= testPaper.value.length) {
          currentQuestionIndex.value = testPaper.value.length - 1;
        }
      }
      ElMessage.success('已成功“斩”除此题！');
    } else {
      ElMessage.error('删除失败：' + result.message);
    }
  }).catch(() => {
    // User canceled
  });
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
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
}

function nextQuestion() {
  if (currentQuestionIndex.value < testPaper.value.length - 1) {
    currentQuestionIndex.value++;
  }
}

async function submitQuiz() {
  clearInterval(timer);
  isScoring.value = true;

  // Initialize feedback for all subjective questions
  testPaper.value.forEach(q => {
    if (q.type === 'short_answer' || q.type === 'code') {
      if (!userAnswers.value[q.id] || !userAnswers.value[q.id].trim()) {
        // For unanswered subjective questions, give 0 score directly
        aiFeedback.value[q.id] = { isCorrect: false, feedback: '未作答', score: 0 };
      }
    }
  });

  const questionsToJudge = testPaper.value.filter(q => 
    (q.type === 'short_answer' || q.type === 'code') && userAnswers.value[q.id] && userAnswers.value[q.id].trim()
  );

  for (const question of questionsToJudge) {
    const result = await judgeAnswer(question, question.answer, userAnswers.value[question.id]);
    aiFeedback.value[question.id] = result;
  }
  
  calculateTotalScore();
  finalGrade.value = getGrade(totalScore.value);
  
  isScoring.value = false;
  quizSubmitted.value = true;

  // Save the final state
  saveQuizState({
    testPaper: testPaper.value,
    userAnswers: userAnswers.value,
    totalScore: totalScore.value,
    finalGrade: finalGrade.value,
    aiFeedback: aiFeedback.value,
  });

  // Now that all scoring is complete, correctly identify and add wrong questions.
  testPaper.value.forEach(question => {
    if (!isCorrect(question)) {
      const userAnswer = userAnswers.value[question.id];
      addWrongQuestion(question.id, userAnswer);
    }
  });
}

function calculateTotalScore() {
  let score = 0;
  for (const question of testPaper.value) {
    if (question.type === 'short_answer' || question.type === 'code') {
      if (aiFeedback.value[question.id]) {
        score += aiFeedback.value[question.id].score;
      }
    } else {
      if (isCorrect(question)) {
        score += question.score;
      }
    }
  }
  totalScore.value = Math.round(score);
}

function getOptionClass(question, option) {
  const classes = ['review-option'];
  const isCorrect = question.type === 'single' 
    ? question.answer === option 
    : (question.answer || []).includes(option);
  
  const userAnswer = userAnswers.value[question.id];
  const isSelected = question.type === 'single'
    ? userAnswer === option
    : (userAnswer || []).includes(option);

  if (isCorrect) {
    classes.push('correct-answer');
  }
  if (isSelected) {
    classes.push('user-selection');
  }
  if (isSelected && !isCorrect) {
    classes.push('wrong-selection');
  }
  return classes.join(' ');
}

function reviewAnswers() {
  showReview.value = true;
  activeCollapse.value = testPaper.value
    .filter(q => !isCorrect(q))
    .map(q => q.id);
}

function backToResults() {
  showReview.value = false;
}

function formatUserAnswer(answer) {
    if (answer === null || answer === undefined || answer === '') return '未作答';
    if (Array.isArray(answer)) {
        return answer.length > 0 ? answer.join(', ') : '未作答';
    }
    return answer;
}

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.box-card {
  max-width: 800px;
  margin: 20px auto;
  font-size: 16px;
}
.review-options-container {
  margin-top: 10px;
}
.review-option {
  padding: 8px 12px;
  margin: 5px 0;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  transition: all 0.3s ease;
  line-height: 1.5;
}
.review-option.correct-answer {
  border-color: #67c23a;
  background-color: #f0f9eb;
}
.review-option.user-selection {
  border-width: 2px;
  position: relative;
  padding-left: 30px;
}
.review-option.user-selection::before {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-weight: bold;
}
.review-option.correct-answer.user-selection::before {
  content: '✔';
  color: #67c23a;
}
.review-option.wrong-selection {
  border-color: #f56c6c;
  background-color: #fef0f0;
}
.review-option.wrong-selection.user-selection::before {
  content: '✖';
  color: #f56c6c;
}
.review-option:not(.correct-answer).user-selection {
  border-color: #f56c6c;
}

.code-prompt {
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', Courier, monospace;
  margin: 15px 0;
}

.question-actions {
  margin-top: 20px;
  text-align: right;
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
.grade {
  font-weight: bold;
  color: #409EFF;
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
}
</style>
