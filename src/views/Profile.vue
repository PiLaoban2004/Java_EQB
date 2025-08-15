<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>个人中心</span>
      </div>
    </template>
    <div class="profile-content">
      <div v-if="isLoggedIn">
        <h2>欢迎, {{ currentUser?.username }}!</h2>
        <h3>学习进度</h3>
        <div class="progress-container">
          <el-progress :text-inside="true" :stroke-width="24" :percentage="masteryProgress.progress || 0" status="success" />
          <p class="progress-text">
            已掌握 {{ masteryProgress.masteredCount }} / {{ masteryProgress.totalQuestions }} 道题
          </p>
        </div>
        <el-button type="primary" @click="goToWrongBook">我的错题本</el-button>
        <el-button type="danger" @click="handleLogout" style="margin-left: 10px;">退出登录</el-button>
      </div>
      <div v-else>
        <h2>{{ isRegistering ? '注册' : '登录' }}</h2>
        <el-form @submit.prevent="isRegistering ? handleRegister() : handleLogin()">
          <el-form-item label="用户名">
            <el-input v-model="username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit">{{ isRegistering ? '注册' : '登录' }}</el-button>
            <el-button type="text" @click="isRegistering = !isRegistering">
              {{ isRegistering ? '已有账号？去登录' : '没有账号？去注册' }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getMasteryProgress } from '../services/masteryService';
import { isAuthenticated, getCurrentUser, loginUser, registerUser, logoutUser } from '../services/userService';
import { ElMessage } from 'element-plus'; // Assuming Element Plus is used for messages

const router = useRouter();

const isLoggedIn = ref(false);
const currentUser = ref(null);
const username = ref('');
const password = ref('');
const isRegistering = ref(true); // To toggle between login and register forms

const masteryProgress = ref({
  masteredCount: 0,
  totalQuestions: 0,
  progress: 0,
});

const loadUserData = async () => {
  console.log('loadUserData: Checking authentication status...');
  isLoggedIn.value = isAuthenticated();
  console.log('loadUserData: isLoggedIn.value =', isLoggedIn.value);

  if (isLoggedIn.value) {
    console.log('loadUserData: User is logged in, getting current user...');
    currentUser.value = getCurrentUser();
    console.log('loadUserData: Current user =', currentUser.value);
    try {
      console.log('loadUserData: Fetching mastery progress...');
      masteryProgress.value = await getMasteryProgress();
      console.log('loadUserData: Mastery progress fetched =', masteryProgress.value);
    } catch (error) {
      console.error('loadUserData: Error fetching mastery progress:', error);
      masteryProgress.value = { masteredCount: 0, totalQuestions: 0, progress: 0 };
    }
  } else {
    console.log('loadUserData: User is not logged in, resetting mastery progress.');
    masteryProgress.value = { masteredCount: 0, totalQuestions: 0, progress: 0 };
  }
  console.log('loadUserData: Finished.');
};

onMounted(loadUserData);

const handleLogin = async () => {
  const result = await loginUser(username.value, password.value);
  if (result.success) {
    ElMessage.success('登录成功！');
    await loadUserData();
    username.value = '';
    password.value = '';
  } else {
    ElMessage.error(result.error || '登录失败，请检查用户名和密码。');
  }
};

const handleRegister = async () => {
  const result = await registerUser(username.value, password.value);
  if (result.success) {
    ElMessage.success('注册成功！已自动登录。');
    await loadUserData();
    username.value = '';
    password.value = '';
    isRegistering.value = false; // Switch back to login form after successful registration
  } else {
    ElMessage.error(result.error || '注册失败，请稍后再试。');
  }
};

const handleLogout = () => {
  logoutUser();
  isLoggedIn.value = false;
  currentUser.value = null;
  masteryProgress.value = { masteredCount: 0, totalQuestions: 0, progress: 0 };
  ElMessage.info('已退出登录。');
  router.push('/'); // Redirect to home or login page
};

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
.el-form {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
