<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>学习资料</span>
      </div>
    </template>
    <div @click="toggleContent" class="material-title">
      {{ materialName }}
    </div>
    <div v-if="showContent" class="material-content" v-html="renderedMarkdown"></div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';
import { marked } from 'marked';

const renderedMarkdown = ref('');
const showContent = ref(false);
const materialName = ref('Java - Collection');
const contentLoaded = ref(false);

const toggleContent = async () => {
  showContent.value = !showContent.value;
  if (showContent.value && !contentLoaded.value) {
    try {
      const response = await fetch('/materials/Java - Collection.md');
      if (!response.ok) {
        throw new Error('Failed to fetch material');
      }
      const markdownText = await response.text();
      renderedMarkdown.value = marked(markdownText);
      contentLoaded.value = true;
    } catch (error) {
      console.error('Error loading material:', error);
      renderedMarkdown.value = '<p>无法加载学习资料，请稍后再试。</p>';
    }
  }
};
</script>

<style scoped>
.box-card {
  max-width: 900px;
  margin: 20px auto;
}
.card-header {
  font-weight: bold;
}
.material-title {
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  padding: 10px 20px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
}
.material-title:hover {
  background-color: #f0f0f0;
}
.material-content {
  padding: 20px;
  line-height: 1.6;
}
.material-content :deep(h1),
.material-content :deep(h2),
.material-content :deep(h3) {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}
.material-content :deep(pre) {
  background-color: #f4f4f4;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
}
.material-content :deep(code) {
  font-family: 'Courier New', Courier, monospace;
}
.material-content :deep(blockquote) {
  border-left: 4px solid #ccc;
  padding-left: 15px;
  color: #666;
  margin-left: 0;
}
</style>
