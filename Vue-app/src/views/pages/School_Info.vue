<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const { getPrimary, getSurface, isDarkTheme } = useLayout();
const route = useRoute();

// 院校数据 - 提供默认值避免模板错误
const university = ref({
  id: '',
  name: '加载中...',
  location: '未知',
  tags: [],
  logo: '',
  description: '暂无描述',
  stats: {
    faculty: 0,
    students: 0,
    labs: 0,
    employmentRate: 0,
    ratingValue: 0
  }
});

const schoolDetails = ref({
  job: '暂无数据',
  school_site: '暂无官网',
  email: '暂无邮箱',
  phone: '暂无电话',
  content: '暂无简介'
});

const majorScores = ref([]);
const loading = ref(true);

// 获取院校详细信息
const fetchSchoolDetails = async () => {
  try {
    loading.value = true;
    const schoolId = route.params.id;
    
    // 从后端获取院校基本信息
    const basicInfoResponse = await axios.get(`http://localhost:3000/api/school/${schoolId}`);
    
    // 从后端获取院校详细信息
    const detailResponse = await axios.get(`http://localhost:3000/api/school-detail/${schoolId}`);
    
    if (basicInfoResponse.data.length > 0) {
      const basicInfo = basicInfoResponse.data[0];
      university.value = {
        id: basicInfo.school_id,
        name: basicInfo.school_name,
        location: basicInfo.province_name,
        tags: [
          ...(basicInfo.is985 ? ['985'] : []),
          ...(basicInfo.is211 ? ['211'] : [])
        ],
        logo: `/logo/${basicInfo.school_id}.jpg`,
        description: detailResponse.data?.content || '暂无描述',
        stats: {
          faculty: Math.floor(Math.random() * 5000) + 1000,
          students: Math.floor(Math.random() * 50000) + 10000,
          labs: Math.floor(Math.random() * 200) + 50,
          employmentRate: parseFloat(detailResponse.data?.job) || 95,
          ratingValue: 4.5
        }
      };
    }
    
    if (detailResponse.data) {
      schoolDetails.value = {
        job: detailResponse.data.job ? detailResponse.data.job + '%' : '暂无数据',
        school_site: detailResponse.data.school_site || '暂无官网',
        email: detailResponse.data.email || '暂无邮箱',
        phone: detailResponse.data.phone || '暂无电话',
        content: detailResponse.data.content || '暂无简介',
        ruanke_rank: detailResponse.data.ruanke_rank,
        xyh_rank: detailResponse.data.xyh_rank,
        us_rank: detailResponse.data.us_rank,
        male_rate: detailResponse.data.men_rate,
        female_rate: detailResponse.data.female_rate
      };
    }
    
  } catch (error) {
    console.error('获取院校详情失败:', error);
    // 使用默认数据
    university.value = {
      id: route.params.id,
      name: '院校信息',
      location: '未知',
      tags: [],
      description: '暂无描述',
      stats: {
        faculty: 0,
        students: 0,
        labs: 0,
        employmentRate: 0,
        ratingValue: 0
      }
    };
    schoolDetails.value = {
      job: '暂无数据',
      school_site: '暂无官网',
      email: '暂无邮箱',
      phone: '暂无电话',
      content: '暂无简介'
    };
  } finally {
    loading.value = false;
  }
};

// 获取专业分数线和省份排名
const fetchMajorScores = async () => {
  try {
    const schoolId = route.params.id;
    const response = await axios.get(`http://localhost:3000/api/school-majors/${schoolId}`);
    majorScores.value = response.data;
  } catch (error) {
    console.error('获取专业分数线和省份排名失败:', error);
  }
};

onMounted(() => {
  fetchSchoolDetails();
  fetchMajorScores();
});

// 监听路由参数变化
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchSchoolDetails();
      fetchMajorScores();
    }
  }
);
</script>

<template>
  <Fluid class="grid grid-cols-12 gap-8">
    <!-- 院校基本信息 -->
    <div class="col-span-12">
      <div class="card flex flex-col md:flex-row gap-6 p-6">
        <Avatar 
          :image="university.logo" 
          size="xlarge" 
          shape="circle"
          class="w-24 h-24"
        />
        <div class="flex-1">
          <div class="text-3xl font-bold mb-4">{{ university.name }}</div>
          <div class="flex flex-wrap items-center gap-3 mb-4">
            <Tag 
              v-for="tag in university.tags" 
              :key="tag"
              :value="tag"
              severity="info"
              rounded
            />
            <span class="text-color-secondary text-sm">
              <i class="pi pi-map-marker mr-1"></i>
              {{ university.location }}
            </span>
          </div>
          <p class="text-color-secondary leading-relaxed">
            {{ university.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- 院校统计数据 -->
    <div class="col-span-12">
      <div class="card p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="text-center">
          <div class="text-2xl font-bold">{{ university.stats.faculty }}</div>
          <div class="text-color-secondary text-sm">教师人数</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold">{{ university.stats.students }}</div>
          <div class="text-color-secondary text-sm">在校学生</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold">{{ university.stats.labs }}</div>
          <div class="text-color-secondary text-sm">国家级实验室</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold">
            {{ schoolDetails.male_rate && schoolDetails.female_rate ? (schoolDetails.male_rate / schoolDetails.female_rate).toFixed(2) : 'N/A' }}
          </div>
          <div class="text-color-secondary text-sm">男女比例</div>
        </div>
      </div>
    </div>

    <!-- 院校详情 -->
    <div class="col-span-12">
      <div class="card p-6">
        <div class="font-semibold text-lg mb-4">院校详情</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex items-center gap-4">
            <i class="pi pi-briefcase text-primary"></i>
            <div>
              <div class="text-sm text-color-secondary">就业率</div>
              <div class="font-semibold">{{ schoolDetails.job }}</div>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <i class="pi pi-globe text-primary"></i>
            <div>
              <div class="text-sm text-color-secondary">官方网站</div>
              <a 
                v-if="schoolDetails.school_site && schoolDetails.school_site !== '暂无官网'" 
                :href="schoolDetails.school_site.startsWith('http') ? schoolDetails.school_site : 'http://' + schoolDetails.school_site" 
                target="_blank" 
                class="text-primary font-semibold hover:underline"
              >
                {{ schoolDetails.school_site }}
              </a>
              <span v-else class="font-semibold text-color-secondary">
                {{ schoolDetails.school_site }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <i class="pi pi-envelope text-primary"></i>
            <div>
              <div class="text-sm text-color-secondary">联系邮箱</div>
              <div class="font-semibold">{{ schoolDetails.email }}</div>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <i class="pi pi-phone text-primary"></i>
            <div>
              <div class="text-sm text-color-secondary">联系电话</div>
              <div class="font-semibold">{{ schoolDetails.phone }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 学校排名 -->
    <div class="col-span-12">
      <div class="card p-6">
        <div class="font-semibold text-lg mb-4">学校排名</div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="text-4xl font-bold text-primary">{{ schoolDetails.ruanke_rank || 'N/A' }}</div>
            <div class="text-sm text-color-secondary">软科排名</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-primary">{{ schoolDetails.xyh_rank || 'N/A' }}</div>
            <div class="text-sm text-color-secondary">校友会排名</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-primary">{{ schoolDetails.us_rank || 'N/A' }}</div>
            <div class="text-sm text-color-secondary">US News排名</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 专业分数线和省份排名 -->
    <div class="col-span-12">
      <div class="card p-6">
        <div class="font-semibold text-2xl mb-6 text-center ">专业分数详情</div>
        <div v-if="loading" class="text-center">
          <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
          <p class="mt-4 text-lg text-color-secondary">加载中...</p>
        </div>
        <div v-else>
          <div v-for="major in majorScores" :key="major.major_name" class="flex items-center justify-between border-b border-surface-border py-4 hover:bg-surface-card transition">
            <div class="text-lg font-bold text-primary flex-1 major-name" >{{ major.major_name }}</div>
            <div class="flex items-center gap-4 flex-1 justify-center">
              <div class="text-sm text-color-secondary">最低分: <span class="text-lg font-semibold text-primary">{{ major.min }}</span></div>
              <div class="text-sm text-color-secondary">最高分: <span class="text-lg font-semibold text-primary">{{ major.max }}</span></div>
              <div class="text-sm text-color-secondary">平均分: <span class="text-lg font-semibold text-primary">{{ major.average }}</span></div>
              <div class="text-sm text-color-secondary">最低省排名: <span class="text-lg font-semibold text-primary">{{ major.min_section }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Fluid>
</template>

<style scoped>
/* 完全匹配模板的卡片样式 */
.card {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* 强制图表继承模板的文字颜色 */
:deep(.p-chart) text {
  fill: var(--text-color) !important;
  font-family: inherit !important;
}

/* 标签样式增强 */
:deep(.p-tag) {
  font-weight: 500;
  padding: 0.25rem 0.75rem;
}

/* 院校详情卡片样式 */
.card {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

/* 专业分数详情样式调整 */
.major-name {
  white-space: normal;
  word-break: break-word;
}
</style>