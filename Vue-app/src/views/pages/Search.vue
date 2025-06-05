<script setup>
import { computed, onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRoute } from 'vue-router';

const toast = useToast();
const route = useRoute();

const universities = ref([]);

// 收藏状态管理
const favoriteStatus = ref(new Map());

// 志愿表状态管理  
const wishlistStatus = ref(new Map());

// 当前添加模式的类别（从URL参数获取）
const addCategory = ref(route.query.category || null);

// 检查用户是否已登录
const isLoggedIn = computed(() => {
  return localStorage.getItem('token') !== null;
});

// Fetch university data from the API
const fetchUniversities = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/universities');
    const data = await response.json();
    universities.value = data.map(uni => {
      let logoUrl = '/logo/default.jpg'; // Default fallback logo
      if (uni.school_id) {
        logoUrl = `/logo/${uni.school_id}.jpg`;
      } else {
        console.warn(`Missing school_id for university:`, uni);
      }
      // console.log(`Generated logo URL for ${uni.school_name || uni.name}:`, logoUrl);
      return {
        ...uni,
        // Ensure compatibility with existing 'name' and 'location' if API uses 'school_name' and 'province_name'
        name: uni.school_name || uni.name,
        location: uni.province_name || uni.location,
        tags: Array.isArray(uni.tags)
          ? uni.tags
          : [
              ...(uni.is985 ? ['985'] : []),
              ...(uni.is211 ? ['211'] : [])
            ],
        logo: logoUrl
      };
    });
    console.log('Fetched Universities for Search.vue:', universities.value);
  } catch (error) {
    console.error('Error fetching universities for Search.vue:', error);
  }
};

// 检查院校收藏状态
const checkFavoriteStatus = async (schoolId) => {
  if (!isLoggedIn.value) return false;
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/user/favorites/check/${schoolId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result.success ? result.isFavorited : false;
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    return false;
  }
};

// 检查院校志愿表状态
const checkWishlistStatus = async (schoolId) => {
  if (!isLoggedIn.value) return { inWishlist: false, category: null };
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/user/wishlist/check/${schoolId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result.success ? { inWishlist: result.inWishlist, category: result.category } : { inWishlist: false, category: null };
  } catch (error) {
    console.error('检查志愿表状态失败:', error);
    return { inWishlist: false, category: null };
  }
};

// 批量检查收藏状态
const updateFavoriteStatuses = async () => {
  if (!isLoggedIn.value) return;
  
  for (const uni of universities.value) {
    const isFavorited = await checkFavoriteStatus(uni.school_id);
    favoriteStatus.value.set(uni.school_id, isFavorited);
  }
};

// 批量检查志愿表状态
const updateWishlistStatuses = async () => {
  if (!isLoggedIn.value) return;
  
  for (const uni of universities.value) {
    const status = await checkWishlistStatus(uni.school_id);
    wishlistStatus.value.set(uni.school_id, status);
  }
};

// 切换收藏状态
const toggleFavorite = async (university) => {
  if (!isLoggedIn.value) {
    toast.add({
      severity: 'warn',
      summary: '未登录',
      detail: '请先登录后再收藏院校',
      life: 3000
    });
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const schoolId = university.school_id;
    const isFavorited = favoriteStatus.value.get(schoolId);

    if (isFavorited) {
      // 取消收藏
      const response = await fetch(`http://localhost:3000/api/user/favorites/${schoolId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      
      if (result.success) {
        favoriteStatus.value.set(schoolId, false);
        toast.add({
          severity: 'success',
          summary: '操作成功',
          detail: '已取消收藏',
          life: 3000
        });
      } else {
        throw new Error(result.message);
      }
    } else {
      // 添加收藏
      const favoriteData = {
        school_id: university.school_id,
        school_name: university.school_name || university.name,
        province_name: university.province_name || university.location,
        school_type: university.school_type,
        is985: university.is985 === true || university.is985 === 1,
        is211: university.is211 === true || university.is211 === 1,
        score: university.score ? parseInt(university.score, 10) : null,
        rank_num: university.rank ? parseInt(university.rank, 10) : null
      };

      const response = await fetch('http://localhost:3000/api/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(favoriteData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        favoriteStatus.value.set(schoolId, true);
        toast.add({
          severity: 'success',
          summary: '收藏成功',
          detail: '已添加到我的收藏',
          life: 3000
        });
      } else {
        throw new Error(result.message);
      }
    }
  } catch (error) {
    console.error('收藏操作失败:', error);
    toast.add({
      severity: 'error',
      summary: '操作失败',
      detail: error.message || '收藏操作失败，请重试',
      life: 3000
    });
  }
};

// 添加到志愿表
const addToWishlist = async (university, category = null) => {
  if (!isLoggedIn.value) {
    toast.add({
      severity: 'warn',
      summary: '未登录',
      detail: '请先登录后再添加到志愿表',
      life: 3000
    });
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const targetCategory = category || addCategory.value || 'stable';
    
    const wishlistData = {
      school_id: university.school_id,
      school_name: university.school_name || university.name,
      province_name: university.province_name || university.location,
      school_type: university.school_type,
      score: university.score ? parseInt(university.score, 10) : null,
      rank_num: university.rank ? parseInt(university.rank, 10) : null,
      category: targetCategory
    };

    const response = await fetch('http://localhost:3000/api/user/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(wishlistData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      wishlistStatus.value.set(university.school_id, { inWishlist: true, category: targetCategory });
      
      const categoryNames = {
        rush: '冲刺',
        stable: '稳妥', 
        safe: '保底'
      };
      
      toast.add({
        severity: 'success',
        summary: '添加成功',
        detail: `已添加到${categoryNames[targetCategory]}院校`,
        life: 3000
      });
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('添加到志愿表失败:', error);
    toast.add({
      severity: 'error',
      summary: '添加失败',
      detail: error.message || '添加到志愿表失败，请重试',
      life: 3000
    });
  }
};

onMounted(async () => {
  await fetchUniversities();
  await updateFavoriteStatuses();
  await updateWishlistStatuses();
});

// 搜索和筛选状态
const searchText = ref('');
const selectedTags = ref([]);
const sortBy = ref('rank');

// 可用标签选项
const availableTags = ['985', '211', '双一流'];

// 筛选后的院校列表
const filteredUniversities = computed(() => {
  return universities.value.filter(uni => {
    const uniName = uni.school_name || uni.name || '';
    const uniLocation = uni.province_name || uni.location || '';
    const matchesSearch = uniName.includes(searchText.value) || 
                         uniLocation.includes(searchText.value);
    const matchesTags = selectedTags.value.length === 0 || 
                       (Array.isArray(uni.tags) && uni.tags.some(tag => selectedTags.value.includes(tag)));
    return matchesSearch && matchesTags;
  }).sort((a, b) => {
    if (sortBy.value === 'rank') {
      return (a.rank || Infinity) - (b.rank || Infinity);
    }
    if (sortBy.value === 'score') {
      return (b.score || 0) - (a.score || 0); // Higher score first
    }
    return 0;
  });
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
              :label="uni.name ? uni.name[0] : ''" 
              size="large" 
              shape="circle"
              class="bg-primary text-primary-contrast"
              @error="console.error(`Error loading logo for ${uni.name}:`, uni.logo)"
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
                :severity="tagSeverity[tag] || 'secondary'"
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
        </template>        <template #footer>
          <div class="flex flex-col gap-2">
            <!-- 第一行按钮 -->
            <div class="flex justify-between">
              <router-link :to="'/school_info/' + (uni.school_id || uni.id)">
                <Button 
                  label="查看详情" 
                  icon="pi pi-info-circle" 
                  severity="secondary"
                  outlined
                  size="small"
                />
              </router-link>
              <Button 
                :label="favoriteStatus.get(uni.school_id) ? '已收藏' : '收藏'" 
                :icon="favoriteStatus.get(uni.school_id) ? 'pi pi-heart-fill' : 'pi pi-heart'" 
                :severity="favoriteStatus.get(uni.school_id) ? 'danger' : 'help'"
                :outlined="!favoriteStatus.get(uni.school_id)"
                @click="toggleFavorite(uni)"
                :disabled="!isLoggedIn"
                size="small"
              />
            </div>
            
            <!-- 第二行：志愿表按钮 -->
            <div v-if="isLoggedIn" class="flex gap-2">
              <!-- 如果有特定类别参数，显示单个按钮 -->
              <template v-if="addCategory">
                <Button 
                  v-if="!wishlistStatus.get(uni.school_id)?.inWishlist"
                  :label="`添加到${addCategory === 'rush' ? '冲刺' : addCategory === 'stable' ? '稳妥' : '保底'}院校`"
                  icon="pi pi-plus" 
                  :severity="addCategory === 'rush' ? 'info' : addCategory === 'stable' ? 'success' : 'warn'"
                  @click="addToWishlist(uni, addCategory)"
                  class="flex-1"
                  size="small"
                />
                <Tag 
                  v-else
                  :value="`已在${wishlistStatus.get(uni.school_id)?.category === 'rush' ? '冲刺' : wishlistStatus.get(uni.school_id)?.category === 'stable' ? '稳妥' : '保底'}院校中`"
                  :severity="wishlistStatus.get(uni.school_id)?.category === 'rush' ? 'info' : wishlistStatus.get(uni.school_id)?.category === 'stable' ? 'success' : 'warn'"
                  class="flex-1"
                />
              </template>
                <!-- 否则显示三个类别按钮 -->
              <template v-else>
                <div v-if="!wishlistStatus.get(uni.school_id)?.inWishlist" class="flex gap-1 flex-1">
                  <Button 
                    label="冲一冲" 
                    icon="pi pi-arrow-up" 
                    severity="info"
                    @click="addToWishlist(uni, 'rush')"
                    size="small"
                    class="flex-1"
                  />
                  <Button 
                    label="稳一稳" 
                    icon="pi pi-check" 
                    severity="success"
                    @click="addToWishlist(uni, 'stable')"
                    size="small"
                    class="flex-1"
                  />
                  <Button 
                    label="保一保" 
                    icon="pi pi-shield" 
                    severity="warn"
                    @click="addToWishlist(uni, 'safe')"
                    size="small"
                    class="flex-1"
                  />
                </div>
                <div v-else class="flex gap-1 flex-1">
                  <Tag 
                    :value="`已在${wishlistStatus.get(uni.school_id)?.category === 'rush' ? '冲刺' : wishlistStatus.get(uni.school_id)?.category === 'stable' ? '稳妥' : '保底'}院校中`"
                    :severity="wishlistStatus.get(uni.school_id)?.category === 'rush' ? 'info' : wishlistStatus.get(uni.school_id)?.category === 'stable' ? 'success' : 'warn'"
                    class="flex-1"
                  />
                </div>
              </template>
            </div>
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