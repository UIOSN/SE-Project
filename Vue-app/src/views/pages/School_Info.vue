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
        content: detailResponse.data.content || '暂无简介'
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

// 图表数据
const scoreTrendData = ref(null);
const majorDistributionData = ref(null);
const facultyRadarData = ref(null);
const rankTrendData = ref(null);
const employmentPieData = ref(null);
const scoreTrendOptions = ref(null);
const majorDistributionOptions = ref(null);
const facultyRadarOptions = ref(null);
const rankTrendOptions = ref(null);
const employmentPieOptions = ref(null);

onMounted(() => {
  fetchSchoolDetails();
  initChartData();
});

function initChartData() {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

  // 使用模板中的标准配色
  const colors = {
    primary500: documentStyle.getPropertyValue('--p-primary-500'),
    primary200: documentStyle.getPropertyValue('--p-primary-200'),
    indigo500: documentStyle.getPropertyValue('--p-indigo-500'),
    indigo400: documentStyle.getPropertyValue('--p-indigo-400'),
    purple500: documentStyle.getPropertyValue('--p-purple-500'),
    purple400: documentStyle.getPropertyValue('--p-purple-400'),
    teal500: documentStyle.getPropertyValue('--p-teal-500'),
    teal400: documentStyle.getPropertyValue('--p-teal-400'),
    orange500: documentStyle.getPropertyValue('--p-orange-500')
  };

  // 1. 分数线趋势（使用模板中的折线图配色）
  scoreTrendData.value = {
    labels: ['2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: '最低录取分',
        data: [680, 685, 688, 692, 695],
        fill: false,
        borderColor: colors.primary500,
        backgroundColor: colors.primary500,
        tension: 0.4
      },
      {
        label: '省控线',
        data: [550, 555, 558, 560, 562],
        fill: false,
        borderColor: colors.primary200,
        backgroundColor: colors.primary200,
        borderDash: [5, 5],
        tension: 0.4
      }
    ]
  };
  scoreTrendOptions.value = {
    plugins: {
      legend: {
        labels: { 
          color: textColor,
          font: { weight: 500 }
        }
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${ctx.raw}分`
        }
      }
    },
    scales: {
      x: { 
        ticks: { 
          color: textColorSecondary,
          font: { weight: 500 }
        },
        grid: { 
          color: surfaceBorder,
          drawBorder: false
        }
      },
      y: { 
        ticks: { color: textColorSecondary },
        grid: { 
          color: surfaceBorder,
          drawBorder: false
        }
      }
    }
  };

  // 2. 专业分数分布（使用模板中的柱状图配色）
  majorDistributionData.value = {
    labels: ['计算机', '电子工程', '建筑学', '经济管理', '机械工程'],
    datasets: [
      {
        label: '最低分',
        backgroundColor: colors.primary500,
        borderColor: colors.primary500,
        data: [705, 698, 690, 695, 685]
      },
      {
        label: '平均分',
        backgroundColor: colors.primary200,
        borderColor: colors.primary200,
        data: [715, 705, 700, 708, 695]
      }
    ]
  };
  majorDistributionOptions.value = {
    plugins: {
      legend: {
        labels: { 
          color: textColor,
          font: { weight: 500 }
        }
      }
    },
    scales: {
      x: {
        ticks: { 
          color: textColorSecondary,
          font: { weight: 500 }
        },
        grid: { 
          display: false,
          drawBorder: false
        }
      },
      y: {
        ticks: { color: textColorSecondary },
        grid: { 
          color: surfaceBorder,
          drawBorder: false
        }
      }
    }
  };

  // 3. 师资力量雷达图（使用模板中的雷达图配色）
  facultyRadarData.value = {
    labels: ['院士人数', '教授占比', '国家级人才', '国际师资', '师生比'],
    datasets: [
      {
        label: '清华大学',
        borderColor: colors.indigo400,
        pointBackgroundColor: colors.indigo400,
        pointBorderColor: colors.indigo400,
        pointHoverBackgroundColor: textColor,
        pointHoverBorderColor: colors.indigo400,
        data: [88, 35, 120, 25, 1.8]
      },
      {
        label: '全国平均',
        borderColor: colors.purple400,
        pointBackgroundColor: colors.purple400,
        pointBorderColor: colors.purple400,
        pointHoverBackgroundColor: textColor,
        pointHoverBorderColor: colors.purple400,
        data: [15, 12, 30, 8, 3.5]
      }
    ]
  };
  facultyRadarOptions.value = {
    plugins: {
      legend: { 
        labels: { 
          color: textColor,
          font: { weight: 500 }
        }
      }
    },
    scales: {
      r: {
        angleLines: { color: surfaceBorder },
        grid: { color: textColorSecondary },
        pointLabels: { color: textColorSecondary }
      }
    }
  };

  // 4. 排名趋势（使用模板中的多色折线）
  rankTrendData.value = {
    labels: ['2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'QS世界排名',
        data: [17, 16, 15, 14, 12],
        borderColor: colors.indigo500,
        backgroundColor: colors.indigo500,
        tension: 0.4
      },
      {
        label: '软科中国排名',
        data: [1, 1, 1, 1, 1],
        borderColor: colors.teal500,
        backgroundColor: colors.teal500,
        tension: 0.4
      }
    ]
  };
  rankTrendOptions.value = {
    plugins: {
      legend: { 
        labels: { 
          color: textColor,
          font: { weight: 500 }
        }
      }
    },
    scales: {
      x: { 
        ticks: { color: textColorSecondary },
        grid: { color: surfaceBorder }
      },
      y: { 
        ticks: { color: textColorSecondary },
        grid: { color: surfaceBorder }
      }
    }
  };

  // 5. 就业去向（使用模板中的饼图配色）
  employmentPieData.value = {
    labels: ['国内升学', '出国深造', '直接就业', '自主创业'],
    datasets: [
      {
        data: [55, 15, 28, 2],
        backgroundColor: [
          colors.indigo500,
          colors.purple500,
          colors.teal500,
          colors.orange500
        ],
        hoverBackgroundColor: [
          colors.indigo400,
          colors.purple400,
          colors.teal400,
          colors.orange500
        ]
      }
    ]
  };
  employmentPieOptions.value = {
    plugins: {
      legend: {
        labels: {
          color: textColor,
          usePointStyle: true,
          font: { weight: 500 }
        }
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.label}: ${ctx.raw}%`
        }
      }
    }
  };
}

watch(
  [getPrimary, getSurface, isDarkTheme],
  () => {
    initChartData();
  },
  { immediate: true }
);

// 监听路由参数变化
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchSchoolDetails();
    }
  }
);
</script>

<template>

    <Fluid class="grid grid-cols-12 gap-8">
        <!-- 院校基本信息 -->
        <div class="col-span-12">
        <div class="card flex flex-col md:flex-row gap-4 p-4">
            <Avatar 
            :image="university.logo" 
            size="xlarge" 
            shape="circle"
            class="w-20 h-20 md:w-24 md:h-24"
            />
            <div class="flex-1">
            <div class="text-2xl font-bold mb-2">{{ university.name }}</div>
            
            <div class="flex flex-wrap items-center gap-2 mb-3">
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
            <p class="text-surface-700 dark:text-surface-300 text-sm">{{ university.description }} </p>
            
            </div>
            
            <div class="grid grid-rows-2 grid-cols-2 md:grid-cols-4 gap-3">
              
            <div class="text-center">
                <div class="text-xl font-bold">{{ university.stats.faculty }}</div>
                <div class="text-color-secondary text-sm">教师人数</div>
            </div>
            <div class="text-center">
                <div class="text-xl font-bold">{{ university.stats.students }}</div>
                <div class="text-color-secondary text-sm">在校学生</div>
            </div>
            <div class="text-center">
                <div class="text-xl font-bold">{{ university.stats.labs }}</div>
                <div class="text-color-secondary text-sm">国家级实验室</div>
            </div>
            <div class="text-center">
                <div class="text-xl font-bold">{{ university.stats.employmentRate }}%</div>
                <div class="text-color-secondary text-sm">就业率</div>
            </div>
            <Rating v-model="university.stats.ratingValue" />
            <p class="text-color-secondary text-sm mt-3.5 ">{{ university.stats.ratingValue }}</p>
            
            
            </div>
            
        </div>
        </div>

        <!-- 分数线趋势 -->
        <div class="col-span-12 lg:col-span-6">
        <div class="card p-4">
            <div class="font-semibold text-lg mb-3">近5年录取分数线趋势</div>
            <Chart 
            type="line" 
            :data="scoreTrendData" 
            :options="scoreTrendOptions" 
            class="h-16rem"
            />
        </div>
        </div>

        <!-- 专业分数分布 -->
        <div class="col-span-12 lg:col-span-6">
        <div class="card p-4">
            <div class="font-semibold text-lg mb-3">各专业录取分数分布</div>
            <Chart 
            type="bar" 
            :data="majorDistributionData" 
            :options="majorDistributionOptions" 
            class="h-16rem"
            />
        </div>
        </div>

        <!-- 师资力量雷达图 -->
        <!-- <div class="col-span-12 lg:col-span-6">
        <div class="card p-4">
            <div class="font-semibold text-lg mb-3">师资力量对比</div>
            <Chart 
            type="radar" 
            :data="facultyRadarData" 
            :options="facultyRadarOptions" 
            class="h-16rem"
            />
        </div>
        </div> -->
        <div class="col-span-12 xl:col-span-6">
                <div class="card flex flex-col items-center">
                    <div class="font-semibold text-xl mb-4">Radar</div>
                    <Chart type="radar" :data="facultyRadarData" :options="facultyRadarOptions"></Chart>
                </div>
            </div>

        <!-- 排名趋势 -->
        <div class="col-span-12 lg:col-span-6">
        <div class="card p-4">
            <div class="font-semibold text-lg mb-3">国内外排名趋势</div>
            <Chart 
            type="line" 
            :data="rankTrendData" 
            :options="rankTrendOptions" 
            class="h-16rem"
            />
        </div>
        </div>

        <!-- 就业去向 -->
        <!-- <div class="col-span-12 lg:col-span-6">
        <div class="card p-4">
            <div class="font-semibold text-lg mb-3">毕业生去向分布</div>
            <Chart 
            type="pie" 
            :data="employmentPieData" 
            :options="employmentPieOptions" 
            class="h-16rem"
            />
        </div>
        </div> -->
        <div class="col-span-12 xl:col-span-6">
            <div class="card flex flex-col items-center">
                <div class="font-semibold text-xl mb-4">毕业生去向分布</div>
                <Chart type="doughnut" :data="employmentPieData" :options="employmentPieOptions"></Chart>
            </div>
        </div>

        <!-- 特色优势 -->
        <div class="col-span-12 lg:col-span-6">
        <div class="card p-4 h-full">
            <div class="font-semibold text-lg mb-3">特色优势</div>
            <div class="flex flex-col gap-3">
            <div v-for="n in 3" :key="n" class="flex items-start gap-2">
                <i class="pi pi-check-circle text-primary mt-1"></i>
                <div>
                <div class="font-medium">顶尖学科建设</div>
                <p class="text-color-secondary text-sm mt-1">
                    拥有{{ n * 5 + 10 }}个A+学科，涵盖工学、理学、医学等多个领域
                </p>
                </div>
            </div>
            </div>
        </div>
        </div>

        <!-- 院校详情 -->
        <div class="col-span-12">
          <div class="card p-4">
            <div class="font-semibold text-lg mb-4">院校详情</div>
            <div v-if="loading" class="text-center">
              <i class="pi pi-spin pi-spinner text-2xl"></i>
              <p class="mt-2">加载中...</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-center gap-3">
                <i class="pi pi-briefcase text-primary"></i>
                <div>
                  <div class="text-sm text-color-secondary">就业率</div>
                  <div class="font-semibold">{{ schoolDetails.job }}</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
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
              <div class="flex items-center gap-3">
                <i class="pi pi-envelope text-primary"></i>
                <div>
                  <div class="text-sm text-color-secondary">联系邮箱</div>
                  <div class="font-semibold">{{ schoolDetails.email }}</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <i class="pi pi-phone text-primary"></i>
                <div>
                  <div class="text-sm text-color-secondary">联系电话</div>
                  <div class="font-semibold">{{ schoolDetails.phone }}</div>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <div class="text-sm text-color-secondary mb-2">学校简介</div>
              <p class="text-surface-700 dark:text-surface-300 leading-relaxed">
                {{ schoolDetails.content }}
              </p>
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

/* 图表容器高度与模板一致 */
.h-16rem {
  height: 16rem;
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
</style>