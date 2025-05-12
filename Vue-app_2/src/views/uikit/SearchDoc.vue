<script setup>
import { computed, ref, onMounted } from 'vue';

const universities = ref([]);

const fetchUniversities = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/universities');
    const data = await response.json();
    // 自动生成 tags 字段，兼容后端只返回 is985/is211 的情况
    universities.value = data.map(uni => ({
      ...uni,
      tags: Array.isArray(uni.tags)
        ? uni.tags
        : [
            ...(uni.is985 ? ['985'] : []),
            ...(uni.is211 ? ['211'] : [])
          ]
    }));
    console.log('Fetched Universities:', universities.value);
  } catch (error) {
    console.error('Error fetching universities:', error);
  }
};

onMounted(() => {
  fetchUniversities();
  console.log('Selected Tags on Mount:', selectedTags.value);
});

// 搜索和筛选状态
const searchText = ref('');
const selectedTags = ref([]);
const sortBy = ref('rank');
const selectedType = ref('全部');

// 可用标签选项
const availableTags = ['985', '211'];
const availableTypes = [
  '全部',
  '综合类',
  '理工类',
  '师范类',
  '医药类',
  '语言类',
  '艺术类',
  '财经类',
  '政法类',
  '农林类',
  '体育类'
];

// 筛选后的院校列表
const filteredUniversities = computed(() => {
  return universities.value
    .filter(uni => {
      const matchesSearch = (searchText.value === '' ||
        uni.school_name?.includes(searchText.value) ||
        uni.province_name?.includes(searchText.value));
      const matchesType = (selectedType.value === '全部' || uni.school_type === selectedType.value);
      const matchesTags = (
        selectedTags.value.length === 0 ||
        (Array.isArray(uni.tags) && selectedTags.value.every(tag => uni.tags.includes(tag)))
      );
      return matchesSearch && matchesType && matchesTags;
    });
});

// 分页状态
const currentPage = ref(1);
const rowsPerPage = 12;

const paginatedUniversities = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  return filteredUniversities.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredUniversities.value.length / rowsPerPage);
});

const changePage = (page) => {
  currentPage.value = page;
};

const visiblePageRange = 5; // Number of visible pagination buttons

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const range = Math.floor(visiblePageRange / 2);

  let start = Math.max(1, current - range);
  let end = Math.min(total, current + range);

  if (end - start + 1 < visiblePageRange) {
    if (start === 1) {
      end = Math.min(total, start + visiblePageRange - 1);
    } else if (end === total) {
      start = Math.max(1, end - visiblePageRange + 1);
    }
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// 标签颜色映射
const tagSeverity = {
  '985': 'warn',
  '211': 'info'
};

function onTagsChange(val) {
  console.log('Selected Tags Changed:', val);
}
</script>

<template>
  <div class="card flex flex-col gap-6">
    <!-- 搜索和筛选区域 -->
    <div class="flex flex-col md:flex-row gap-4 items-start md:items-end">
      <!-- 搜索框 -->
      <div class="flex-1 min-w-0">
        <label class="block font-medium mb-2">院校搜索</label>
        <InputText 
          v-model="searchText" 
          placeholder="输入院校名称或地区" 
          class="w-full"
        />
      </div>

      <!-- 标签筛选 -->
      <div>
        <label class="block font-medium mb-2">院校标签</label>
        <div class="flex gap-2">
          <MultiSelect
            v-model="selectedTags"
            :options="availableTags.map(tag => ({ label: String(tag), value: String(tag) }))"
            optionLabel="label"
            optionValue="value"
            placeholder="选择标签"
            display="chip"
            class="w-full md:w-64"
            @update:modelValue="onTagsChange"
          />
        </div>
      </div>

      <!-- 类型筛选 -->
      <div>
        <label class="block font-medium mb-2">院校类型</label>
        <select v-model="selectedType" class="w-full md:w-40 border rounded px-2 py-2">
          <option v-for="type in availableTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>

      <!-- 排序 -->
      <!-- <div>
        <label class="block font-medium mb-2">排序方式</label>
        <Dropdown
          v-model="sortBy"
          :options="[
            { label: '按排名', value: 'rank' },
            { label: '按分数线', value: 'score' }
          ]"
          optionLabel="label"
          optionValue="value"
          class="w-full md:w-40"
        />
      </div> -->
    </div>

    <!-- 院校列表 -->
    <div class="university-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="university in paginatedUniversities" :key="university.id" class="university-card bg-white rounded-xl shadow-md flex flex-col items-center p-6 hover:shadow-lg transition">
        <div class="w-20 h-20 flex items-center justify-center bg-gray-50 rounded-full mb-4 overflow-hidden border border-gray-200">
          <img :src="university.logo" alt="University Logo" class="object-contain w-16 h-16" />
        </div>
        <h3 class="font-bold text-xl text-center mb-1">{{ university.school_name }}</h3>
        <p class="text-sm text-gray-500 text-center mb-2">{{ university.province_name }} · {{ university.school_type }}</p>
        <div class="flex gap-2 mb-4">
          <span v-if="university.is985" class="px-2 py-0.5 rounded bg-yellow-400 text-white text-xs font-semibold">985</span>
          <span v-if="university.is211" class="px-2 py-0.5 rounded bg-blue-500 text-white text-xs font-semibold">211</span>
        </div>
        <button class="detail-button w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded transition">查看详情</button>
      </div>
    </div>

    <!-- 分页 -->
    <div class="flex justify-center mt-6">
      <button 
        v-if="visiblePages[0] > 1"
        @click="changePage(1)"
        class="px-4 py-2 mx-1 bg-gray-200"
      >
        1...
      </button>
      <button 
        v-for="page in visiblePages" 
        :key="page" 
        @click="changePage(page)" 
        :class="['px-4 py-2 mx-1', { 'bg-blue-500 text-white': page === currentPage, 'bg-gray-200': page !== currentPage }]"
      >
        {{ page }}
      </button>
      <button 
        v-if="visiblePages[visiblePages.length - 1] < totalPages"
        @click="changePage(totalPages)"
        class="px-4 py-2 mx-1 bg-gray-200"
      >
        ...{{ totalPages }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 保持与原有UI一致的卡片样式 */
.card {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

/* 标签颜色增强 */
.p-tag-danger {
  background: var(--red-500) !important;
}
.p-tag-warning {
  background: var(--orange-500) !important;
}
.p-tag-success {
  background: var(--green-500) !important;
}
</style>