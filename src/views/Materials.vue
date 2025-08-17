<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>学习资料</span>
        <el-button type="primary" @click="addNewMaterial">添加新资料</el-button>
      </div>
    </template>
    <div v-for="material in materials" :key="material.id" class="material-item">
      <div @click="toggleContent(material)" class="material-title">
        {{ material.name }}
      </div>
      <div v-if="material.showContent" class="material-content" v-html="material.renderedMarkdown"></div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { marked } from 'marked';
import materialsData from '@/materials.json';

const materials = ref(materialsData.map(item => ({ ...item, showContent: false, renderedMarkdown: '', contentLoaded: false })));

const toggleContent = async (material) => {
  material.showContent = !material.showContent;
  if (material.showContent && !material.contentLoaded) {
    try {
      const response = await fetch(`/materials/${material.name}`);
      if (!response.ok) {
        throw new Error('Failed to fetch material content');
      }
      const markdownText = await response.text();
      material.renderedMarkdown = marked(markdownText);
      material.contentLoaded = true;
    } catch (error) {
      console.error('Error loading material content:', error);
      material.renderedMarkdown = '<p>无法加载学习资料，请稍后再试。</p>';
    }
  }
};

// onMounted(fetchMaterials);

const addNewMaterial = async () => {
  // This is a placeholder for a real implementation.
  // In a real app, this would involve a file upload and a server-side update.
  // Here, we simulate it by directly calling a (non-existent) API endpoint.
  
  // Step 1: Let's assume a new file 'Java-New-Material.md' is "uploaded".
  // We can't create files directly, so we'll just update the manifest.
  
  // Step 2: Update the materials.json manifest.
  // We'll fetch the current list, add the new item, and "post" it back.
  // This is a simulation as we don't have a POST endpoint.
  
  const newMaterial = {
    id: 'java-new-material',
    name: 'Java-New-Material.md'
  };

  // Add to the current view directly for immediate feedback
  const exists = materials.value.some(m => m.id === newMaterial.id);
  if (!exists) {
    materials.value.push({ ...newMaterial, showContent: false, renderedMarkdown: '', contentLoaded: false });
    alert('模拟成功！新的学习资料已添加到列表。在真实应用中，这会涉及到文件上传和后台更新。');
  } else {
    alert('模拟资料已存在。');
  }
};
</script>

<style scoped>
.box-card {
  max-width: 900px;
  margin: 20px auto;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}
.material-item {
  margin-bottom: 10px;
}
.material-title {
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  padding: 10px 20px;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 4px;
}
.material-title:hover {
  background-color: #f0f0f0;
}
.material-content {
  padding: 20px;
  line-height: 1.6;
  border: 1px solid #eee;
  border-top: none;
  border-radius: 0 0 4px 4px;
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
