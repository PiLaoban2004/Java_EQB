<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>我的错题本</span>
        <div>
          <el-button type="primary" @click="reviewWrong" :disabled="wrongQuestions.length === 0">重新检验</el-button>
        </div>
      </div>
    </template>
    
    <div v-if="wrongQuestions.length === 0" class="empty-state">
      <p>太棒了！错题本是空的。</p>
    </div>

    <el-collapse v-else v-model="activeCollapse" class="review-collapse">
      <el-collapse-item v-for="(question, index) in wrongQuestions" :key="question.id" :name="question.id">
        <template #title>
          <span class="wrong-title">{{ index + 1 }}. {{ question.question }}</span>
        </template>

        <p><strong>正确答案:</strong> {{ Array.isArray(question.answer) ? question.answer.join(', ') : question.answer }}</p>
        <p><strong>解析:</strong> {{ question.explanation }}</p>
        
        <el-button size="small" type="danger" @click.stop="remove(question.id)" style="margin-top: 10px;">
          我已掌握，移出错题本
        </el-button>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getWrongQuestions, removeWrongQuestion } from '../services/wrongBookService.js';
import { ElMessage, ElMessageBox } from 'element-plus';

const wrongQuestions = ref([]);
const activeCollapse = ref([]);

onMounted(() => {
  loadWrongQuestions();
});

function loadWrongQuestions() {
  wrongQuestions.value = getWrongQuestions();
}

function remove(questionId) {
  ElMessageBox.confirm(
    '确定要将这道题移出错题本吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    removeWrongQuestion(questionId);
    loadWrongQuestions(); // Refresh the list
    ElMessage({
      type: 'success',
      message: '已成功移出错题本',
    });
  }).catch(() => {
    // User canceled
  });
}

function reviewWrong() {
    ElMessage.info('重新检验功能正在开发中...');
}
</script>

<style scoped>
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
.empty-state {
  text-align: center;
  padding: 40px;
  color: #909399;
}
.review-collapse {
  margin-top: 20px;
}
.wrong-title {
  color: #F56C6C;
}
</style>
