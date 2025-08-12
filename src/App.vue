<template>
  <el-container>
    <el-header class="app-header">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        :router="true"
      >
        <el-menu-item index="/">在线考试</el-menu-item>
        <el-menu-item index="/profile">个人中心</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const activeIndex = ref(route.path);

const handleSelect = (key) => {
  activeIndex.value = key;
};
</script>

<style>
/* Global styles */
body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  margin: 0;
}

.app-header {
  padding: 0;
  border-bottom: solid 1px #e6e6e6;
}

.el-menu-demo {
  max-width: 800px;
  margin: 0 auto;
}
</style>
