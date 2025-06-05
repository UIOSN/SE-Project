<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();

// 志愿表数据
const universities = ref({
  rush: [],
  stable: [],
  safe: []
});

// 加载状态
const loading = ref(false);

// 用户分数和排名（从个人信息获取）
const userScore = ref(0);
const userRank = ref(0);
const hasUserInfo = ref(false);

// 检查用户是否已登录
const isLoggedIn = computed(() => {
  return localStorage.getItem('token') !== null;
});

// 获取用户基本信息
const loadUserInfo = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await fetch('http://localhost:3000/api/user/info', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    if (result.success && result.data) {
      userScore.value = result.data.score || 0;
      userRank.value = result.data.rank || 0;
      hasUserInfo.value = true;
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
};

// 获取志愿表数据
const loadWishlist = async () => {
  if (!isLoggedIn.value) {
    toast.add({
      severity: 'warn',
      summary: '未登录',
      detail: '请先登录查看志愿表',
      life: 3000
    });
    router.push('/auth/login');
    return;
  }

  try {
    loading.value = true;
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:3000/api/user/wishlist', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    if (result.success) {
      universities.value = result.data;
    } else {
      throw new Error(result.message || '获取志愿表失败');
    }
  } catch (error) {
    console.error('获取志愿表失败:', error);
    toast.add({
      severity: 'error',
      summary: '获取失败',
      detail: error.message || '无法获取志愿表数据',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

// 移动院校类别
const moveUniversity = async (source, destination, univ) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`http://localhost:3000/api/user/wishlist/${univ.school_id}/category`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ category: destination })
    });

    const result = await response.json();
    if (result.success) {
      // 在前端更新数据
      const sourceIndex = universities.value[source].findIndex(u => u.school_id === univ.school_id);
      if (sourceIndex > -1) {
        universities.value[source].splice(sourceIndex, 1);
        universities.value[destination].push({
          ...univ,
          category: destination
        });
      }
      
      toast.add({
        severity: 'success',
        summary: '移动成功',
        detail: `已将 ${univ.school_name} 移动到${getCategoryName(destination)}`,
        life: 3000
      });
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('移动院校失败:', error);
    toast.add({
      severity: 'error',
      summary: '移动失败',
      detail: error.message || '移动院校失败',
      life: 3000
    });
  }
};

// 删除院校
const removeUniversity = async (category, univ) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`http://localhost:3000/api/user/wishlist/${univ.school_id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    if (result.success) {
      // 在前端更新数据
      universities.value[category] = universities.value[category].filter(u => u.school_id !== univ.school_id);
      
      toast.add({
        severity: 'success',
        summary: '删除成功',
        detail: `已从志愿表删除 ${univ.school_name}`,
        life: 3000
      });
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('删除院校失败:', error);
    toast.add({
      severity: 'error',
      summary: '删除失败',
      detail: error.message || '删除院校失败',
      life: 3000
    });
  }
};

// 添加院校到指定类别
const addToWishlist = (category) => {
  router.push(`/search?category=${category}`);
};

// 提交志愿表
const submitWishlist = async () => {
  try {
    const totalCount = universities.value.rush.length + universities.value.stable.length + universities.value.safe.length;
    
    if (totalCount === 0) {
      toast.add({
        severity: 'warn',
        summary: '无法提交',
        detail: '志愿表为空，请先添加院校',
        life: 3000
      });
      return;
    }

    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:3000/api/user/wishlist/submit', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    if (result.success) {
      toast.add({
        severity: 'success',
        summary: '提交成功',
        detail: '志愿表已成功提交',
        life: 3000
      });
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('提交志愿表失败:', error);
    toast.add({
      severity: 'error',
      summary: '提交失败',
      detail: error.message || '提交志愿表失败',
      life: 3000
    });
  }
};

// 计算录取概率
const calculateChance = (univ) => {
  if (!hasUserInfo.value || !userScore.value || !univ.score) {
    return '--';
  }
  
  const scoreDiff = userScore.value - univ.score;
  const rankDiff = userRank.value - (univ.rank || 0);
  
  let chance;
  if (scoreDiff >= 30) chance = 85;
  else if (scoreDiff >= 10) chance = 65;
  else if (scoreDiff >= 0) chance = 45;
  else if (scoreDiff >= -10) chance = 25;
  else chance = 10;
  
  // 根据排名进行微调
  if (rankDiff < 0) chance += 5;
  else if (rankDiff > 1000) chance -= 5;
  
  return Math.min(95, Math.max(5, chance)) + '%';
};

// 获取类别中文名
const getCategoryName = (category) => {
  const names = {
    rush: '冲刺院校',
    stable: '稳妥院校',
    safe: '保底院校'
  };
  return names[category] || category;
};

// 组件挂载时加载数据
onMounted(async () => {
  await loadUserInfo();
  await loadWishlist();
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 用户成绩信息显示 -->
    <div class="card p-6">
      <div class="font-semibold text-xl mb-4">我的成绩信息</div>
      <div v-if="hasUserInfo" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label class="text-surface-600 dark:text-surface-300">我的分数</label>
          <div class="text-2xl font-bold text-primary">{{ userScore }}分</div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-surface-600 dark:text-surface-300">我的排名</label>
          <div class="text-2xl font-bold text-primary">第{{ userRank }}名</div>
        </div>
      </div>
      <div v-else class="text-center py-4">
        <div class="text-surface-500 mb-4">
          <i class="pi pi-info-circle text-3xl"></i>
        </div>
        <p class="text-surface-600 mb-4">请先完善个人信息，以便更好地评估录取概率</p>
        <router-link to="/info">
          <Button label="去完善信息" icon="pi pi-arrow-right" />
        </router-link>
      </div>
    </div>

    <!-- 志愿填报区 -->
    <div v-if="loading" class="text-center py-8">
      <ProgressSpinner />
      <p class="mt-4 text-surface-600">正在加载志愿表...</p>
    </div>
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 冲一冲 -->
      <div class="card">
        <div class="bg-blue-100 dark:bg-blue-900 p-4 rounded-t-lg">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-lg text-blue-800 dark:text-blue-200">冲一冲</h3>
            <Tag :value="`${universities.rush.length}/10所`" severity="info" />
          </div>
          <div class="text-sm text-blue-600 dark:text-blue-300 mt-1">
            录取概率20%-40%，建议3-5所
          </div>
        </div>
        <div class="p-4 min-h-[400px]">
          <div v-if="universities.rush.length === 0" class="text-center py-8">
            <div class="text-surface-400 mb-4">
              <i class="pi pi-inbox text-4xl"></i>
            </div>
            <p class="text-surface-500 mb-4">暂无冲刺院校</p>
            <Button 
              icon="pi pi-plus" 
              label="添加冲刺院校" 
              @click="addToWishlist('rush')"
              severity="info"
              outlined
            />
          </div>
          
          <div v-else>
            <div v-for="(item, index) in universities.rush" :key="item.school_id" 
                 class="p-4 border-round border-1 surface-border mb-3">
              <div class="flex gap-4">
                <img 
                  :src="item.logo" 
                  :alt="item.school_name + ' logo'" 
                  class="w-16 h-16 rounded-full object-cover border-2 border-surface-border"
                  @error="$event.target.src = '/logo/default.jpg'"
                />
                <div class="flex-1">
                  <div class="font-bold">{{ item.school_name }}</div>
                  <div class="text-sm text-surface-500 mt-1">
                    <span v-if="item.score">去年分数线: {{ item.score }}分</span>
                    <span v-if="item.rank"> · 排名: 第{{ item.rank }}名</span>
                  </div>
                  <div class="flex flex-wrap gap-1 mt-2">
                    <Tag 
                      v-for="tag in item.tags" 
                      :key="tag"
                      :value="tag"
                      :severity="tag === '985' ? 'warn' : tag === '211' ? 'info' : 'secondary'"
                      size="small"
                    />
                  </div>
                  <div class="mt-2">
                    <div class="flex justify-between text-xs mb-1">
                      <span>录取概率</span>
                      <span class="font-semibold">{{ calculateChance(item) }}</span>
                    </div>
                    <ProgressBar 
                      :value="parseInt(calculateChance(item))" 
                      :showValue="false" 
                      style="height: 6px"
                    />
                  </div>
                </div>
              </div>
              <div class="flex gap-2 mt-3">
                <Button 
                  icon="pi pi-arrow-down" 
                  severity="secondary" 
                  @click="moveUniversity('rush', 'stable', item)"
                  label="降为稳妥" 
                  size="small" 
                />
                <Button 
                  icon="pi pi-trash" 
                  severity="danger" 
                  @click="removeUniversity('rush', item)"
                  outlined 
                  size="small" 
                />
              </div>
            </div>
            <Button 
              icon="pi pi-plus" 
              label="添加更多" 
              @click="addToWishlist('rush')"
              class="w-full mt-2" 
              outlined
              :disabled="universities.rush.length >= 10"
            />
          </div>
        </div>
      </div>

      <!-- 稳一稳 -->
      <div class="card">
        <div class="bg-green-100 dark:bg-green-900 p-4 rounded-t-lg">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-lg text-green-800 dark:text-green-200">稳一稳</h3>
            <Tag :value="`${universities.stable.length}/15所`" severity="success" />
          </div>
          <div class="text-sm text-green-600 dark:text-green-300 mt-1">
            录取概率40%-70%，建议5-8所
          </div>
        </div>
        <div class="p-4 min-h-[400px]">
          <div v-if="universities.stable.length === 0" class="text-center py-8">
            <div class="text-surface-400 mb-4">
              <i class="pi pi-inbox text-4xl"></i>
            </div>
            <p class="text-surface-500 mb-4">暂无稳妥院校</p>
            <Button 
              icon="pi pi-plus" 
              label="添加稳妥院校" 
              @click="addToWishlist('stable')"
              severity="success"
              outlined
            />
          </div>
          
          <div v-else>
            <div v-for="(item, index) in universities.stable" :key="item.school_id" 
                 class="p-4 border-round border-1 surface-border mb-3">
              <div class="flex gap-4">
                <img 
                  :src="item.logo" 
                  :alt="item.school_name + ' logo'" 
                  class="w-16 h-16 rounded-full object-cover border-2 border-surface-border"
                  @error="$event.target.src = '/logo/default.jpg'"
                />
                <div class="flex-1">
                  <div class="font-bold">{{ item.school_name }}</div>
                  <div class="text-sm text-surface-500 mt-1">
                    <span v-if="item.score">去年分数线: {{ item.score }}分</span>
                    <span v-if="item.rank"> · 排名: 第{{ item.rank }}名</span>
                  </div>
                  <div class="flex flex-wrap gap-1 mt-2">
                    <Tag 
                      v-for="tag in item.tags" 
                      :key="tag"
                      :value="tag"
                      :severity="tag === '985' ? 'warn' : tag === '211' ? 'info' : 'secondary'"
                      size="small"
                    />
                  </div>
                  <div class="mt-2">
                    <div class="flex justify-between text-xs mb-1">
                      <span>录取概率</span>
                      <span class="font-semibold">{{ calculateChance(item) }}</span>
                    </div>
                    <ProgressBar 
                      :value="parseInt(calculateChance(item))" 
                      :showValue="false" 
                      style="height: 6px"
                    />
                  </div>
                </div>
              </div>
              <div class="flex gap-2 mt-3">
                <Button 
                  icon="pi pi-arrow-up" 
                  severity="secondary" 
                  @click="moveUniversity('stable', 'rush', item)"
                  label="升为冲刺" 
                  size="small" 
                />
                <Button 
                  icon="pi pi-arrow-down" 
                  severity="secondary" 
                  @click="moveUniversity('stable', 'safe', item)"
                  label="降为保底" 
                  size="small" 
                />
                <Button 
                  icon="pi pi-trash" 
                  severity="danger" 
                  @click="removeUniversity('stable', item)"
                  outlined 
                  size="small" 
                />
              </div>
            </div>
            <Button 
              icon="pi pi-plus" 
              label="添加更多" 
              @click="addToWishlist('stable')"
              class="w-full mt-2" 
              outlined
              :disabled="universities.stable.length >= 15"
            />
          </div>
        </div>
      </div>

      <!-- 保一保 -->
      <div class="card">
        <div class="bg-orange-100 dark:bg-orange-900 p-4 rounded-t-lg">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-lg text-orange-800 dark:text-orange-200">保一保</h3>
            <Tag :value="`${universities.safe.length}/10所`" severity="warn" />
          </div>
          <div class="text-sm text-orange-600 dark:text-orange-300 mt-1">
            录取概率70%+，建议2-4所
          </div>
        </div>
        <div class="p-4 min-h-[400px]">
          <div v-if="universities.safe.length === 0" class="text-center py-8">
            <div class="text-surface-400 mb-4">
              <i class="pi pi-inbox text-4xl"></i>
            </div>
            <p class="text-surface-500 mb-4">暂无保底院校</p>
            <Button 
              icon="pi pi-plus" 
              label="添加保底院校" 
              @click="addToWishlist('safe')"
              severity="warn"
              outlined
            />
          </div>
          
          <div v-else>
            <div v-for="(item, index) in universities.safe" :key="item.school_id" 
                 class="p-4 border-round border-1 surface-border mb-3">
              <div class="flex gap-4">
                <img 
                  :src="item.logo" 
                  :alt="item.school_name + ' logo'" 
                  class="w-16 h-16 rounded-full object-cover border-2 border-surface-border"
                  @error="$event.target.src = '/logo/default.jpg'"
                />
                <div class="flex-1">
                  <div class="font-bold">{{ item.school_name }}</div>
                  <div class="text-sm text-surface-500 mt-1">
                    <span v-if="item.score">去年分数线: {{ item.score }}分</span>
                    <span v-if="item.rank"> · 排名: 第{{ item.rank }}名</span>
                  </div>
                  <div class="flex flex-wrap gap-1 mt-2">
                    <Tag 
                      v-for="tag in item.tags" 
                      :key="tag"
                      :value="tag"
                      :severity="tag === '985' ? 'warn' : tag === '211' ? 'info' : 'secondary'"
                      size="small"
                    />
                  </div>
                  <div class="mt-2">
                    <div class="flex justify-between text-xs mb-1">
                      <span>录取概率</span>
                      <span class="font-semibold">{{ calculateChance(item) }}</span>
                    </div>
                    <ProgressBar 
                      :value="parseInt(calculateChance(item))" 
                      :showValue="false" 
                      style="height: 6px"
                    />
                  </div>
                </div>
              </div>
              <div class="flex gap-2 mt-3">
                <Button 
                  icon="pi pi-arrow-up" 
                  severity="secondary" 
                  @click="moveUniversity('safe', 'stable', item)"
                  label="升为稳妥" 
                  size="small" 
                />
                <Button 
                  icon="pi pi-trash" 
                  severity="danger" 
                  @click="removeUniversity('safe', item)"
                  outlined 
                  size="small" 
                />
              </div>
            </div>
            <Button 
              icon="pi pi-plus" 
              label="添加更多" 
              @click="addToWishlist('safe')"
              class="w-full mt-2" 
              outlined
              :disabled="universities.safe.length >= 10"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="card p-4">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-4">
          <div class="text-lg font-semibold">志愿表统计</div>
          <div class="flex gap-4 text-sm">
            <span class="text-blue-600">冲刺: {{ universities.rush.length }}所</span>
            <span class="text-green-600">稳妥: {{ universities.stable.length }}所</span>
            <span class="text-orange-600">保底: {{ universities.safe.length }}所</span>
            <span class="font-semibold">总计: {{ universities.rush.length + universities.stable.length + universities.safe.length }}所</span>
          </div>
        </div>
        
        <div class="flex gap-3">
          <Button 
            icon="pi pi-search" 
            label="搜索院校" 
            severity="secondary"
            @click="router.push('/search')"
          />
          <Button 
            icon="pi pi-print" 
            label="打印志愿表" 
            severity="info"
            outlined
            @click="window.print()"
          />
          <Button 
            icon="pi pi-check" 
            label="提交志愿表" 
            severity="success"
            @click="submitWishlist"
            :disabled="universities.rush.length + universities.stable.length + universities.safe.length === 0"
          />
        </div>
      </div>
      
      <!-- 提示信息 -->
      <div class="text-sm text-surface-600">
        <div class="flex items-center gap-2 mb-2">
          <i class="pi pi-info-circle text-primary"></i>
          <span>建议志愿表总数控制在10-20所院校，合理分配冲刺、稳妥、保底院校比例</span>
        </div>
        <div class="flex items-center gap-2">
          <i class="pi pi-lightbulb text-warn"></i>
          <span>点击院校卡片可查看详细信息，通过按钮可调整院校类别或删除</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 保持与模板一致的卡片样式 */
.card {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>