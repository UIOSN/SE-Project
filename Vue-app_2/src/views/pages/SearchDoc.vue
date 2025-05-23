<script setup>
import { computed, onMounted, ref } from 'vue';

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
            :options="availableTags"
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
        <Dropdown
          v-model="selectedType"
          :options="availableTypes"
          placeholder="选择类型"
          class="w-full md:w-40"
        />
      </div>

      <!-- 排序 -->
      <div>
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
      </div>
    </div>

    <!-- 院校列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="uni in paginatedUniversities" :key="uni.id" class="hover:shadow-lg transition-all">
        <template #header>
          <div class="flex items-center p-4 gap-4">
            <Avatar 
              :image="uni.logo" 
              :label="uni.school_name ? uni.school_name[0] : ''" 
              size="large" 
              shape="circle"
              class="bg-primary text-primary-contrast"
            />
            <div>
              <div class="text-xl font-semibold">{{ uni.school_name }}</div>
              <div class="text-color-secondary">{{ uni.province_name }} · {{ uni.school_type }}</div>
            </div>
          </div>
        </template>
        
        <template #content>
          <div class="flex flex-col gap-3">
            <!-- 院校标签 -->
            <div class="flex flex-wrap gap-2">
              <Tag 
                v-for="tag in uni.tags" 
                :key="tag"
                :value="tag"
                :severity="tagSeverity[tag]"
                :rounded="true"
              />
            </div>
            
            <!-- 院校数据 -->
            <div class="grid grid-cols-2 gap-4 mt-3">
              <div v-if="uni.score">
                <div class="text-sm text-color-secondary">最低分数线</div>
                <div class="text-xl font-bold">{{ uni.score }}分</div>
              </div>
              <div v-if="uni.rank">
                <div class="text-sm text-color-secondary">全国排名</div>
                <div class="text-xl font-bold">第{{ uni.rank }}名</div>
              </div>
            </div>
          </div>
        </template>

        <template #footer>
          <div class="flex justify-between">
            <Button 
              label="查看详情" 
              icon="pi pi-info-circle" 
              severity="secondary"
              outlined
            />
            <Button 
              label="收藏" 
              icon="pi pi-star" 
              severity="help"
              outlined
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- 分页 -->
    <div class="flex justify-center mt-6">
      <Paginator 
        :rows="rowsPerPage" 
        :totalRecords="filteredUniversities.length"
        :first="(currentPage - 1) * rowsPerPage"
        @page="(e) => currentPage = e.page + 1"
        template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      />
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