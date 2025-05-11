<script setup>
import { computed, ref } from 'vue';

// 模拟院校数据
const universities = ref([
  {
    id: 1,
    name: '清华大学',
    location: '北京',
    tags: ['985', '211','双一流'],
    score: 695,
    rank: 1,
    logo: 'https://example.com/tsinghua.png'
  },
  {
    id: 2,
    name: '北京大学',
    location: '北京',
    tags: ['985', '211', '双一流'],
    score: 693,
    rank: 2,
    logo: 'https://example.com/pku.png'
  },
  {
    id: 3,
    name: '浙江大学',
    location: '浙江',
    tags: ['985', '211','双一流'],
    score: 680,
    rank: 3,
    logo: 'https://example.com/zju.png'
  },
  {
    id: 4,
    name: '上海交通大学',
    location: '上海',
    tags: ['985', '211', '双一流'],
    score: 678,
    rank: 4,
    logo: 'https://example.com/sjtu.png'
  }
]);

// 搜索和筛选状态
const searchText = ref('');
const selectedTags = ref([]);
const sortBy = ref('rank');

// 可用标签选项
const availableTags = ['985', '211', '双一流'];

// 筛选后的院校列表
const filteredUniversities = computed(() => {
  return universities.value.filter(uni => {
    const matchesSearch = uni.name.includes(searchText.value) || 
                         uni.location.includes(searchText.value);
    const matchesTags = selectedTags.value.length === 0 || 
                       uni.tags.some(tag => selectedTags.value.includes(tag));
    return matchesSearch && matchesTags;
  }).sort((a, b) => a[sortBy.value] - b[sortBy.value]);
});

// 标签颜色映射
const tagSeverity = {
  '985': 'warn',
  '211': 'info',
  '双一流': 'primary'
};
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
          />
        </div>
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
      <Card v-for="uni in filteredUniversities" :key="uni.id" class="hover:shadow-lg transition-all">
        <template #header>
          <div class="flex items-center p-4 gap-4">
            <Avatar 
              :image="uni.logo" 
              :label="uni.name[0]" 
              size="large" 
              shape="circle"
              class="bg-primary text-primary-contrast"
            />
            <div>
              <div class="text-xl font-semibold">{{ uni.name }}</div>
              <div class="text-color-secondary">{{ uni.location }}</div>
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
              <div>
                <div class="text-sm text-color-secondary">最低分数线</div>
                <div class="text-xl font-bold">{{ uni.score }}分</div>
              </div>
              <div>
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
        :rows="10" 
        :totalRecords="filteredUniversities.length" 
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