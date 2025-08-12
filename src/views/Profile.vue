<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>个人中心</span>
      </div>
    </template>
    <div class="profile-content">
      <p>欢迎来到您的个人中心。</p>
      <el-button type="primary" @click="goToWrongBook">我的错题本</el-button>
    </div>
  </el-card>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

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
</style>
