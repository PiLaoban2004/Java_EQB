<template>
  <div class="home-container">
    <h1>选择你的考试模式</h1>
    <el-row :gutter="20" class="quiz-options">
      <el-col :span="12">
        <el-card class="box-card quiz-card" @click="startQuiz('special')">
          <template #header>
            <div class="card-header">
              <span>专项练习</span>
            </div>
          </template>
          <div>
            <p>专注于特定题型，包括单选题、多选题和判断题。</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card quiz-card" @click="startQuiz('comprehensive')">
          <template #header>
            <div class="card-header">
              <span>综合测验</span>
            </div>
          </template>
          <div>
            <p>模拟真实考试，包含所有题型，全面检验您的 Java 能力。</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function startQuiz(type) {
  router.push(`/quiz/${type}`);
}
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 40px auto;
  text-align: center;
}
.quiz-options {
  margin-top: 30px;
}
.quiz-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}
.quiz-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}
.card-header {
  font-weight: bold;
  font-size: 1.2em;
}
</style>
