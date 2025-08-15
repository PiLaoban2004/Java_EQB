<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>个人中心</span>
      </div>
    </template>
    <div class="profile-content">
      <h2>学习进度</h2>
      <div class="progress-container">
        <el-progress :text-inside="true" :stroke-width="24" :percentage="masteryProgress.progress || 0" status="success" />
        <p class="progress-text">
          已掌握 {{ masteryProgress.masteredCount }} / {{ masteryProgress.totalQuestions }} 道题
        </p>
      </div>
      <el-button type="primary" @click="goToWrongBook">我的错题本</el-button>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getMasteryProgress } from '../services/masteryService';

const router = useRouter();
const masteryProgress = ref({
  masteredCount: 0,
  totalQuestions: 0,
  progress: 0,
});

onMounted(async () => {
  masteryProgress.value = await getMasteryProgress();
});

function goToWrongBook() {
  router.push('/wrong-book');
}
</script>

<style scoped>
.box-card {
  max-width: 800px;
  margin: 20px auto;
}
.card-header {
  font-weight: bold;
}
.profile-content {
  text-align: center;
  padding: 20px;
}
.progress-container {
  margin: 30px 0;
}
.progress-text {
  margin-top: 10px;
  font-size: 1.1em;
  color: #606266;
}
</style>
