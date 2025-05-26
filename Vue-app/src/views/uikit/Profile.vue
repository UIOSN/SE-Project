<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

// 模拟用户数据
const user = ref({
  id: 123,
  username: 'primevue_user',
  email: 'user@example.com',
  profile: {
    avatar: 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png',
    realName: '张小明',
    location: '北京',
    bio: '高考志愿规划师 | 教育咨询'
  },
  favorites: [1, 3, 4], // 收藏的院校ID
  createdAt: '2023-06-15'
});

// 模拟院校数据
const universities = ref([
  {
    id: 1,
    name: '清华大学',
    location: '北京',
    tags: ['985', '211', '双一流'],
    score: 695,
    rank: 1,
    logo: 'https://www.tsinghua.edu.cn/__local/7/7D/EB/EBE4A0F8F8D3F9E4D4A6F6B3D8_9F6E4F7D_2D4C8.png'
  },
  {
    id: 2,
    name: '北京大学',
    location: '北京',
    tags: ['985', '211', '双一流'],
    score: 693,
    rank: 2,
    logo: 'https://www.pku.edu.cn/images/pku_logo.png'
  },
  {
    id: 3,
    name: '浙江大学',
    location: '浙江',
    tags: ['985', '211', '双一流'],
    score: 680,
    rank: 3,
    logo: 'https://www.zju.edu.cn/_upload/tpl/00/95/118/template118/images/logo.png'
  },
  {
    id: 4,
    name: '上海交通大学',
    location: '上海',
    tags: ['985', '211', '双一流'],
    score: 678,
    rank: 4,
    logo: 'https://www.sjtu.edu.cn/resource/upload/image/20210906/1630913592103069231.png'
  }
]);

// 获取用户收藏的院校
const favoriteUniversities = computed(() => {
  return universities.value.filter(uni => 
    user.value.favorites.includes(uni.id)
  );
});

// 标签颜色映射
const tagSeverity = {
  '985': 'warn',
  '211': 'info',
  '双一流': 'primary'
};

// 取消收藏
const removeFavorite = (universityId) => {
  const index = user.value.favorites.indexOf(universityId);
  if (index !== -1) {
    user.value.favorites.splice(index, 1);
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '已取消收藏',
      life: 3000
    });
  }
};

// 格式化日期
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('zh-CN', options);
};
</script>

<template>
  <div class="card flex flex-col gap-6">
    <!-- 个人信息头部 -->
    <div class="flex flex-col md:flex-row gap-8 items-start md:items-center">
      <Avatar 
        :image="user.profile.avatar" 
        size="xlarge" 
        shape="circle"
        class="w-24 h-24 md:w-32 md:h-32"
      />
      
      <div class="flex-1">
        <div class="flex flex-col gap-2">
          <div class="text-2xl font-bold text-surface-900 dark:text-surface-0">
            {{ user.profile.realName }}
            <Tag value="已认证" severity="success" class="ml-2" />
          </div>
          <div class="text-color-secondary">
            <i class="pi pi-user mr-2"></i>
            {{ user.username }}
          </div>
          <div class="text-color-secondary">
            <i class="pi pi-map-marker mr-2"></i>
            {{ user.profile.location }}
          </div>
          <div class="mt-2 text-surface-700 dark:text-surface-300">
            {{ user.profile.bio }}
          </div>
        </div>
      </div>
      
      <div class="flex flex-col items-center">
        <div class="text-3xl font-bold text-primary">
          {{ user.favorites.length }}
        </div>
        <div class="text-color-secondary">收藏院校</div>
      </div>
    </div>

    <!-- 收藏院校列表 -->
    <div class="mt-6">
      <div class="flex items-center justify-between mb-4">
        <div class="text-xl font-semibold">我的收藏院校</div>
        <div class="text-color-secondary">
          共 {{ favoriteUniversities.length }} 所院校
        </div>
      </div>

      <div v-if="favoriteUniversities.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card v-for="uni in favoriteUniversities" :key="uni.id" class="hover:shadow-lg transition-all">
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
              <router-link :to="'/school_info/' + uni.id">
                <Button 
                  label="查看详情" 
                  icon="pi pi-info-circle" 
                  severity="secondary"
                  outlined
                />
              </router-link>
              <Button 
                label="取消收藏" 
                icon="pi pi-star-fill" 
                severity="help"
                @click="removeFavorite(uni.id)"
                outlined
              />
            </div>
          </template>
        </Card>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-12">
        <i class="pi pi-bookmark text-6xl text-color-secondary mb-4"></i>
        <div class="text-xl text-color-secondary mb-2">暂无收藏院校</div>
        <router-link to="/universities" class="text-primary font-medium">
          去发现院校 →
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 保持与原有UI一致的卡片样式 */
.card {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1rem;
}

/* 头像悬停效果 */
:deep(.p-avatar) {
  transition: transform 0.3s ease;
}
:deep(.p-avatar:hover) {
  transform: scale(1.05);
}

/* 标签颜色增强 */
:deep(.p-tag-warning) {
  background: var(--orange-500) !important;
}
:deep(.p-tag-info) {
  background: var(--blue-500) !important;
}
:deep(.p-tag-primary) {
  background: var(--primary-color) !important;
}
</style>