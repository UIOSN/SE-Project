<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();

// 用户基本信息（从数据库读取）
const user = ref({
  id: null,
  username: '',
  email: '',
  phone: '',
  userType: '',
  profile: {
    avatar: 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png',
    realName: '',
    location: '',
    bio: '高考考生'
  },
  favorites: [1, 3, 4], // 收藏的院校ID（后续可以从数据库读取）
});

// 用户填写的学生信息
const userFormData = ref({
  name: '',
  score: null,
  region: null,
  rank: null,
  selectedSubjects: [],
  preferredMajors: [],
  preferredRegions: [],
  isArtStudent: false,
  remarks: ''
});

// 地区和科目映射数据
const regions = ref([
  { name: '北京', code: 'BJ' },
  { name: '天津', code: 'TJ' },
  { name: '上海', code: 'SH' },
  { name: '重庆', code: 'CQ' },
  { name: '河北', code: 'HE' },
  { name: '山西', code: 'SX' },
  { name: '内蒙古', code: 'NM' },
  { name: '辽宁', code: 'LN' },
  { name: '吉林', code: 'JL' },
  { name: '黑龙江', code: 'HL' },
  { name: '江苏', code: 'JS' },
  { name: '浙江', code: 'ZJ' },
  { name: '安徽', code: 'AH' },
  { name: '福建', code: 'FJ' },
  { name: '江西', code: 'JX' },
  { name: '山东', code: 'SD' },
  { name: '河南', code: 'HA' },
  { name: '湖北', code: 'HB' },
  { name: '湖南', code: 'HN' },
  { name: '广东', code: 'GD' },
  { name: '广西', code: 'GX' },
  { name: '海南', code: 'HI' },
  { name: '四川', code: 'SC' },
  { name: '贵州', code: 'GZ' },
  { name: '云南', code: 'YN' },
  { name: '西藏', code: 'XZ' },
  { name: '陕西', code: 'SN' },
  { name: '甘肃', code: 'GS' },
  { name: '青海', code: 'QH' },
  { name: '宁夏', code: 'NX' },
  { name: '新疆', code: 'XJ' },
  { name: '香港', code: 'HK' },
  { name: '澳门', code: 'MO' },
  { name: '台湾', code: 'TW' }
]);

const subjects = ref([
  { name: '物理', code: 'WL' },
  { name: '化学', code: 'HX' },
  { name: '生物', code: 'SW' },
  { name: '政治', code: 'ZZ' },
  { name: '历史', code: 'LS' },
  { name: '地理', code: 'DL' }
]);

const majors = ref([
  { name: '计算机科学与技术', code: 'CS' },
  { name: '软件工程', code: 'SE' },
  { name: '电子信息工程', code: 'EE' },
  { name: '通信工程', code: 'TE' },
  { name: '自动化', code: 'AE' },
  { name: '电气工程及其自动化', code: 'EEE' },
  { name: '机械工程', code: 'ME' },
  { name: '土木工程', code: 'CE' },
  { name: '化学工程与工艺', code: 'CHE' },
  { name: '材料科学与工程', code: 'MSE' },
  { name: '临床医学', code: 'MED' },
  { name: '药学', code: 'PHA' },
  { name: '护理学', code: 'NUR' },
  { name: '预防医学', code: 'PM' },
  { name: '金融学', code: 'FIN' },
  { name: '经济学', code: 'ECO' },
  { name: '国际经济与贸易', code: 'IET' },
  { name: '会计学', code: 'ACC' },
  { name: '工商管理', code: 'BM' },
  { name: '市场营销', code: 'MKT' },
  { name: '人力资源管理', code: 'HRM' },
  { name: '法学', code: 'LAW' },
  { name: '政治学与行政学', code: 'PA' },
  { name: '社会学', code: 'SOC' },
  { name: '汉语言文学', code: 'CL' },
  { name: '新闻学', code: 'JOU' },
  { name: '英语', code: 'ENG' },
  { name: '数学与应用数学', code: 'MATH' },
  { name: '物理学', code: 'PHY' },
  { name: '化学', code: 'CHEM' },
  { name: '生物科学', code: 'BIO' },
  { name: '环境科学与工程', code: 'ENV' },
  { name: '建筑学', code: 'ARC' },
  { name: '城乡规划', code: 'UP' },
  { name: '风景园林', code: 'LA' },
  { name: '艺术设计学', code: 'AD' },
  { name: '音乐学', code: 'MUS' },
  { name: '心理学', code: 'PSY' },
  { name: '统计学', code: 'STAT' },
  { name: '信息管理与信息系统', code: 'IM' },
  { name: '人工智能', code: 'AI' },
  { name: '数据科学与大数据技术', code: 'DS' }
]);

// 模拟院校数据（保持原有）
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

// 加载用户信息
onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.add({
        severity: 'error',
        summary: '未登录',
        detail: '请先登录',
        life: 3000
      });
      router.push('/auth/login');
      return;
    }

    // 从后端API获取用户完整信息
    const response = await fetch('http://localhost:3000/api/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    
    if (result.success && result.data) {
      // 更新用户基本信息（来自users表）
      user.value.id = result.data.user.id;
      user.value.username = result.data.user.username;
      user.value.email = result.data.user.email;
      user.value.phone = result.data.user.phone;
      user.value.userType = result.data.user.userType;

      // 如果有学生信息，更新学生信息
      if (result.data.studentInfo) {
        userFormData.value = result.data.studentInfo;
        // 学生信息中的姓名用于显示，但不覆盖用户基本信息
        user.value.profile.realName = result.data.studentInfo.name;
        user.value.profile.location = getRegionName(result.data.studentInfo.region);
      } else {
        // 如果没有学生信息，使用用户名作为显示名称
        user.value.profile.realName = result.data.user.username;
        user.value.profile.location = '未填写';
      }

      // 根据用户类型设置bio
      const userTypeMap = {
        'student': '高考考生',
        'teacher': '教育工作者',
        'parent': '家长用户'
      };
      user.value.profile.bio = userTypeMap[result.data.user.userType] || '用户';
      
    } else {
      throw new Error(result.message || '获取用户信息失败');
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    toast.add({
      severity: 'error',
      summary: '获取失败',
      detail: '无法获取用户信息，请重新登录',
      life: 3000
    });
    
    // 如果API调用失败，尝试从localStorage读取备份
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      const data = JSON.parse(savedData);
      userFormData.value = data;
      user.value.profile.realName = data.name || '未填写';
      user.value.profile.location = getRegionName(data.region) || '未填写';
    }
  }
});

// 辅助函数：获取地区名称
const getRegionName = (code) => {
  if (!code) return '未填写';
  const region = regions.value.find(r => r.code === code);
  return region ? region.name : code;
};

// 辅助函数：获取科目名称列表
const getSubjectNames = (codes) => {
  if (!codes || codes.length === 0) return ['未选择'];
  return codes.map(code => {
    const subject = subjects.value.find(s => s.code === code);
    return subject ? subject.name : code;
  });
};

// 辅助函数：获取专业名称列表
const getMajorNames = (codes) => {
  if (!codes || codes.length === 0) return ['未选择'];
  return codes.map(code => {
    const major = majors.value.find(m => m.code === code);
    return major ? major.name : code;
  });
};

// 辅助函数：获取意向地区名称列表
const getPreferredRegionNames = (codes) => {
  if (!codes || codes.length === 0) return ['未选择'];
  return codes.map(code => {
    const region = regions.value.find(r => r.code === code);
    return region ? region.name : code;
  });
};

// 计算属性：用户填写信息是否完整
const hasUserInfo = computed(() => {
  return userFormData.value.name && userFormData.value.score;
});

// 获取用户收藏的院校（保持原有功能）
const favoriteUniversities = computed(() => {
  return universities.value.filter(uni => 
    user.value.favorites.includes(uni.id)
  );
});

// 标签颜色映射（保持原有）
const tagSeverity = {
  '985': 'warn',
  '211': 'info',
  '双一流': 'primary'
};

// 取消收藏（保持原有功能）
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

// 格式化日期（保持原有）
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('zh-CN', options);
};
</script>

<template>
  <div class="profile-container">
    <!-- 个人信息卡片 -->
    <Card class="profile-header-card">
      <template #content>
        <div class="profile-header">
          <!-- 头像区域 -->
          <div class="avatar-section">
            <div class="avatar-wrapper">
              <Avatar 
                :image="user.profile.avatar" 
                size="xlarge" 
                shape="circle"
                class="profile-avatar"
              />
              <div class="avatar-ring"></div>
            </div>
            <div class="user-status">
              <Tag 
                v-if="hasUserInfo" 
                value="信息已完善" 
                severity="success" 
                class="status-tag"
              >
                <template #default>
                  <i class="pi pi-check-circle mr-1"></i>
                  信息已完善
                </template>
              </Tag>
              <Tag 
                v-else 
                value="待完善信息" 
                severity="warn" 
                class="status-tag"
              >
                <template #default>
                  <i class="pi pi-exclamation-triangle mr-1"></i>
                  待完善信息
                </template>
              </Tag>
            </div>
          </div>

          <!-- 主要信息区域 -->
          <div class="main-info">
            <div class="name-section">
              <h1 class="user-name">
                <i class="pi pi-user-edit name-icon"></i>
                {{ user.profile.realName || user.username || '未填写姓名' }}
              </h1>
              <p class="user-bio">
                <i class="pi pi-id-card bio-icon"></i>
                {{ user.profile.bio }}
              </p>
            </div>

            <!-- 详细信息网格 -->
            <div class="info-grid">
              <!-- 基本联系信息 -->
              <div class="info-group">
                <h3 class="group-title">
                  <div class="title-icon-wrapper">
                    <i class="pi pi-user"></i>
                  </div>
                  基本信息
                </h3>
                <div class="info-items">
                  <div class="info-item">
                    <span class="label">
                      <i class="pi pi-at"></i>
                      用户名
                    </span>
                    <span class="value">{{ user.username || '未设置' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">
                      <i class="pi pi-envelope"></i>
                      邮箱
                    </span>
                    <span class="value">{{ user.email || '未设置' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">
                      <i class="pi pi-phone"></i>
                      电话
                    </span>
                    <span class="value">{{ user.phone || '未设置' }}</span>
                  </div>
                </div>
              </div>

              <!-- 考试信息（如果已填写） -->
              <div v-if="hasUserInfo" class="info-group exam-group">
                <h3 class="group-title">
                  <div class="title-icon-wrapper">
                    <i class="pi pi-bookmark"></i>
                  </div>
                  考试信息
                </h3>
                <div class="info-items">
                  <div class="info-item highlight-item">
                    <span class="label">
                      <i class="pi pi-chart-line"></i>
                      高考总分
                    </span>
                    <span class="value score-value">
                      <span class="score-number">{{ userFormData.score }}</span>
                      <span class="score-unit">分</span>
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="label">
                      <i class="pi pi-map-marker"></i>
                      所在地区
                    </span>
                    <span class="value">{{ getRegionName(userFormData.region) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">
                      <i class="pi pi-sort-numeric-up"></i>
                      地区排名
                    </span>
                    <span class="value rank-value">
                      <span v-if="userFormData.rank">第{{ userFormData.rank }}名</span>
                      <span v-else>未填写</span>
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="label">
                      <i class="pi pi-graduation-cap"></i>
                      考生类型
                    </span>
                    <span class="value type-value">
                      <Tag 
                        :value="userFormData.isArtStudent ? '文科/历史类' : '理科/物理类'"
                        :severity="userFormData.isArtStudent ? 'info' : 'success'"
                        class="type-tag"
                      >
                        <template #default>
                          <i :class="userFormData.isArtStudent ? 'pi pi-book' : 'pi pi-calculator'"></i>
                          {{ userFormData.isArtStudent ? '文科/历史类' : '理科/物理类' }}
                        </template>
                      </Tag>
                    </span>
                  </div>
                </div>
              </div>

              <!-- 学科与意向（如果已填写） -->
              <div v-if="hasUserInfo" class="info-group full-width preference-group">
                <h3 class="group-title">
                  <div class="title-icon-wrapper">
                    <i class="pi pi-star"></i>
                  </div>
                  学科与意向
                </h3>
                <div class="tags-section">
                  <!-- 选考科目 -->
                  <div class="tag-group">
                    <span class="tag-label">
                      <i class="pi pi-objects-column"></i>
                      选考科目
                    </span>
                    <div class="tags-wrapper">
                      <Tag 
                        v-for="subject in getSubjectNames(userFormData.selectedSubjects)" 
                        :key="subject"
                        :value="subject"
                        severity="info"
                        class="subject-tag"
                      >
                        <template #default>
                          <i class="pi pi-check-circle"></i>
                          {{ subject }}
                        </template>
                      </Tag>
                    </div>
                  </div>
                  
                  <!-- 意向专业 -->
                  <div class="tag-group">
                    <span class="tag-label">
                      <i class="pi pi-briefcase"></i>
                      意向专业
                    </span>
                    <div class="tags-wrapper">
                      <Tag 
                        v-for="major in getMajorNames(userFormData.preferredMajors)" 
                        :key="major"
                        :value="major"
                        severity="primary"
                        class="major-tag"
                      >
                        <template #default>
                          <i class="pi pi-heart"></i>
                          {{ major }}
                        </template>
                      </Tag>
                    </div>
                  </div>
                  
                  <!-- 意向地区 -->
                  <div class="tag-group">
                    <span class="tag-label">
                      <i class="pi pi-globe"></i>
                      意向地区
                    </span>
                    <div class="tags-wrapper">
                      <Tag 
                        v-for="region in getPreferredRegionNames(userFormData.preferredRegions)" 
                        :key="region"
                        :value="region"
                        severity="secondary"
                        class="region-tag"
                      >
                        <template #default>
                          <i class="pi pi-map"></i>
                          {{ region }}
                        </template>
                      </Tag>
                    </div>
                  </div>
                  
                  <!-- 备注信息（如果有） -->
                  <div v-if="userFormData.remarks" class="remarks-section">
                    <span class="tag-label">
                      <i class="pi pi-comment"></i>
                      备注信息
                    </span>
                    <div class="remarks-wrapper">
                      <p class="remarks-text">{{ userFormData.remarks }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 统计信息 -->
          <div class="stats-section">
            <div class="stat-item favorites-stat">
              <div class="stat-icon">
                <i class="pi pi-heart-fill"></i>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ user.favorites.length }}</div>
                <div class="stat-label">收藏院校</div>
              </div>
            </div>
            
          </div>
        </div>
      </template>
    </Card>

    <!-- 提示完善信息 -->
    <div v-if="!hasUserInfo" class="info-prompt">
      <Card class="prompt-card">
        <template #content>
          <div class="prompt-content">
            <div class="prompt-left">
              <div class="prompt-icon">
                <i class="pi pi-lightbulb"></i>
              </div>
              <div class="prompt-text">
                <h3>完善考生信息</h3>
                <p>填写详细的个人信息，获得更精准的志愿填报建议</p>
              </div>
            </div>
            <router-link to="/info">
              <Button 
                label="立即完善" 
                icon="pi pi-arrow-right" 
                class="prompt-button"
                size="large"
              />
            </router-link>
          </div>
        </template>
      </Card>
    </div>

    <!-- 收藏院校列表 -->
    <Card class="favorites-card">
      <template #title>
        <div class="section-header">
          <div class="section-title">
            <div class="section-icon">
              <i class="pi pi-heart-fill"></i>
            </div>
            我的收藏院校
          </div>
          <div class="section-count">
            <i class="pi pi-bookmark mr-1"></i>
            共 {{ favoriteUniversities.length }} 所院校
          </div>
        </div>
      </template>
      
      <template #content>
        <div v-if="favoriteUniversities.length > 0" class="universities-grid">
          <Card 
            v-for="uni in favoriteUniversities" 
            :key="uni.id" 
            class="university-card"
          >
            <template #header>
              <div class="university-header">
                <div class="university-avatar-wrapper">
                  <Avatar 
                    :image="uni.logo" 
                    :label="uni.name[0]" 
                    size="large" 
                    shape="circle"
                    class="university-avatar"
                  />
                  <div class="university-badge">
                    <i class="pi pi-verified"></i>
                  </div>
                </div>
                <div class="university-info">
                  <h3 class="university-name">{{ uni.name }}</h3>
                  <p class="university-location">
                    <i class="pi pi-map-marker"></i>
                    {{ uni.location }}
                  </p>
                </div>
              </div>
            </template>
            
            <template #content>
              <div class="university-content">
                <!-- 院校标签 -->
                <div class="university-tags">
                  <Tag 
                    v-for="tag in uni.tags" 
                    :key="tag"
                    :value="tag"
                    :severity="tagSeverity[tag]"
                    class="university-tag"
                  >
                    <template #default>
                      <i class="pi pi-star-fill tag-icon"></i>
                      {{ tag }}
                    </template>
                  </Tag>
                </div>
                
                <!-- 院校数据 -->
                <div class="university-stats">
                  <div class="stat-box score-stat">
                    <div class="stat-icon-small">
                      <i class="pi pi-chart-line"></i>
                    </div>
                    <div class="stat-info">
                      <div class="stat-value">{{ uni.score }}分</div>
                      <div class="stat-desc">最低分数线</div>
                    </div>
                  </div>
                  <div class="stat-box rank-stat">
                    <div class="stat-icon-small">
                      <i class="pi pi-trophy"></i>
                    </div>
                    <div class="stat-info">
                      <div class="stat-value">第{{ uni.rank }}名</div>
                      <div class="stat-desc">全国排名</div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template #footer>
              <div class="university-actions">
                <router-link :to="'/school_info/' + uni.id">
                  <Button 
                    label="查看详情" 
                    icon="pi pi-info-circle" 
                    severity="secondary"
                    outlined
                    size="small"
                  />
                </router-link>
                <Button 
                  label="取消收藏" 
                  icon="pi pi-heart-fill" 
                  severity="danger"
                  outlined
                  size="small"
                  @click="removeFavorite(uni.id)"
                />
              </div>
            </template>
          </Card>
        </div>

        <div v-else class="empty-state">
          <div class="empty-illustration">
            <div class="empty-icon">
              <i class="pi pi-heart"></i>
            </div>
            <div class="empty-sparkles">
              <i class="pi pi-star-fill sparkle-1"></i>
              <i class="pi pi-star-fill sparkle-2"></i>
              <i class="pi pi-star-fill sparkle-3"></i>
            </div>
          </div>
          <h3 class="empty-title">暂无收藏院校</h3>
          <p class="empty-desc">发现心仪的院校，点击 <i class="pi pi-heart"></i> 收藏按钮添加到这里</p>
          <router-link to="/search">
            <Button 
              label="去发现院校" 
              icon="pi pi-search" 
              class="empty-action"
              size="large"
            />
          </router-link>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
/* 主容器 */
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* 个人信息卡片 */
.profile-header-card {
  background: linear-gradient(135deg, var(--surface-card) 0%, var(--surface-ground) 100%);
  border: 1px solid var(--surface-border);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.profile-header-card:hover {
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.profile-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  padding: 2rem;
  align-items: start;
}

/* 头像区域 */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-avatar {
  width: 120px !important;
  height: 120px !important;
  border: 4px solid var(--primary-color);
  box-shadow: 0 8px 32px rgba(var(--primary-color-rgb), 0.2);
  transition: all 0.3s ease;
  z-index: 2;
  position: relative;
}

.avatar-ring {
  position: absolute;
  width: 140px;
  height: 140px;
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  opacity: 0.3;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.1;
  }
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
}

.profile-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 48px rgba(var(--primary-color-rgb), 0.3);
}

.user-status .status-tag {
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 12px;
  padding: 0.5rem 1rem;
}

/* 主要信息区域 */
.main-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 0;
}

.name-section {
  text-align: left;
}

.user-name {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.name-icon {
  color: var(--primary-color);
  font-size: 2rem;
}

.user-bio {
  font-size: 1.1rem;
  color: var(--text-color-secondary);
  margin: 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bio-icon {
  color: var(--primary-color);
}

/* 信息网格 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.info-group {
  background: var(--surface-section);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid var(--surface-border);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.info-group::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color) 0%, var(--primary-600) 100%);
}

.exam-group::before {
  background: linear-gradient(90deg, var(--orange-500) 0%, var(--red-500) 100%);
}

.preference-group::before {
  background: linear-gradient(90deg, var(--purple-500) 0%, var(--pink-500) 100%);
}

.info-group:hover {
  background: var(--surface-hover);
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.info-group.full-width {
  grid-column: 1 / -1;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
}

.title-icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.exam-icon {
  background: linear-gradient(135deg, var(--orange-500) 0%, var(--red-500) 100%);
}

.preference-icon {
  background: linear-gradient(135deg, var(--purple-500) 0%, var(--pink-500) 100%);
}

.info-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: var(--surface-ground);
}

.highlight-item {
  background: linear-gradient(135deg, var(--orange-50) 0%, var(--red-50) 100%);
  border: 1px solid var(--orange-200);
}

.info-item .label {
  font-weight: 500;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-item .label i {
  color: var(--primary-color);
}

.info-item .value {
  font-weight: 600;
  color: var(--text-color);
  text-align: right;
}

/* 分数显示优化 */
.score-value {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  font-size: 1.2rem;
  font-weight: 700;
}

.score-number {
  color: var(--red-500);
  font-size: 1.5rem;
  background: linear-gradient(135deg, var(--orange-500) 0%, var(--red-500) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  /* 确保在深色主题下也能看到 */
  text-shadow: 0 0 0 var(--red-500);
}

.score-unit {
  color: var(--text-color-secondary);
  font-size: 1rem;
}

.rank-value {
  color: var(--blue-500);
  font-weight: 600;
}

.type-value .type-tag {
  font-size: 0.8rem;
}

/* 标签区域 */
.tags-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tag-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tag-label {
  font-weight: 500;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tag-label i {
  color: var(--primary-color);
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.subject-tag, .major-tag, .region-tag {
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.tag-icon {
  font-size: 0.7rem;
}

.remarks-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border);
}

/* 统计区域 */
.stats-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--surface-section);
  border-radius: 16px;
  border: 1px solid var(--surface-border);
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: var(--surface-hover);
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.favorites-stat .stat-icon i {
  color: red !important;
}
.favorites-stat .stat-icon {
  background: linear-gradient(135deg, var(--red-500) 0%, var(--pink-500) 100%);
}

.status-stat .stat-icon {
  background: linear-gradient(135deg, var(--green-500) 0%, var(--teal-500) 100%);
}

.stat-content {
  text-align: left;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-color-secondary);
  font-weight: 500;
}

/* 提示卡片 */
.info-prompt {
  margin: 1rem 0;
}

.prompt-card {
  border-radius: 20px;
  background: linear-gradient(135deg, var(--blue-50) 0%, var(--cyan-50) 100%);
  border: 1px solid var(--blue-200);
}

.prompt-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.prompt-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.prompt-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--yellow-400) 0%, var(--orange-400) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.prompt-text h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.2rem;
  color: var(--text-color);
}

.prompt-text p {
  margin: 0;
  color: var(--text-color-secondary);
}

.prompt-button {
  font-weight: 600;
  border-radius: 12px;
}

/* 收藏院校 */
.favorites-card {
  border-radius: 20px;
  border: 1px solid var(--surface-border);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}

.section-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--red-500) 0%, var(--pink-500) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.section-count {
  font-size: 0.9rem;
  color: var(--text-color-secondary);
  background: var(--surface-section);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
}

.universities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.university-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 1px solid var(--surface-border);
  overflow: hidden;
}

.university-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

.university-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
}

.university-avatar-wrapper {
  position: relative;
}

.university-avatar {
  border: 2px solid var(--surface-border);
}

.university-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--green-500);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  border: 2px solid var(--surface-card);
}

.university-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.25rem 0;
}

.university-location {
  color: var(--text-color-secondary);
  margin: 0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.university-content {
  padding: 0 1.5rem 1.5rem;
}

.university-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.university-tag {
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.university-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--surface-section);
  border-radius: 12px;
}

.stat-icon-small {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
}

.score-stat .stat-icon-small {
  background: linear-gradient(135deg, var(--orange-500) 0%, var(--red-500) 100%);
}

.rank-stat .stat-icon-small {
  background: linear-gradient(135deg, var(--yellow-500) 0%, var(--orange-500) 100%);
}

.stat-info {
  text-align: left;
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.1rem;
}

.stat-desc {
  font-size: 0.8rem;
  color: var(--text-color-secondary);
}

.university-actions {
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: var(--surface-section);
  border-top: 1px solid var(--surface-border);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-color-secondary);
  position: relative;
}

.empty-illustration {
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
}

.empty-icon {
  font-size: 4rem;
  opacity: 0.5;
  color: var(--red-300);
}

.empty-sparkles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.sparkle-1, .sparkle-2, .sparkle-3 {
  position: absolute;
  font-size: 1rem;
  color: var(--yellow-400);
  animation: sparkle 2s infinite;
}

.sparkle-1 {
  top: 10%;
  left: 20%;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 30%;
  right: 15%;
  animation-delay: 0.7s;
}

.sparkle-3 {
  bottom: 20%;
  left: 15%;
  animation-delay: 1.4s;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

.empty-title {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
}

.empty-desc {
  margin: 0 0 2rem 0;
  line-height: 1.6;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.empty-desc i {
  color: var(--red-400);
}

.empty-action {
  font-weight: 600;
  border-radius: 12px;
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .profile-header-card {
    background: linear-gradient(135deg, var(--surface-800) 0%, var(--surface-900) 100%);
  }
  
  .prompt-card {
    background: linear-gradient(135deg, var(--blue-900) 0%, var(--cyan-900) 100%);
    border-color: var(--blue-700);
  }

  .highlight-item {
    background: linear-gradient(135deg, var(--orange-900) 0%, var(--red-900) 100%);
    border-color: var(--orange-700);
  }

  /* 确保分数在深色主题下可见 */
  .score-number {
    color: var(--orange-400) !important;
    -webkit-text-fill-color: var(--orange-400) !important;
    text-shadow: none;
  }
}

/* 学科与意向模块强化样式 */
.preference-group {
  padding: 2rem !important;
}

.preference-group .group-title {
  font-size: 1.35rem !important;
  font-weight: 700 !important;
  margin-bottom: 1.5rem !important;
  border-bottom: 1px solid var(--surface-border);
  padding-bottom: 1rem;
}

.preference-group .title-icon-wrapper {
  width: 40px !important;
  height: 40px !important;
  font-size: 1.2rem !important;
}

/* 标签分组强化 */
.preference-group .tag-group {
  background: var(--surface-ground);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--surface-border);
}

/* 标签标题增强 */
.preference-group .tag-label {
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  margin-bottom: 1rem;
  color: var(--text-color);
  border-bottom: 1px dashed var(--surface-border);
  padding-bottom: 0.75rem;
  display: flex;
  align-items: center;
}

.preference-group .tag-label i {
  font-size: 1.2rem;
  margin-right: 0.5rem;
  color: var(--primary-color);
}

/* 增强标签样式 */
.preference-group .tags-wrapper {
  gap: 0.75rem !important;
}

.preference-group .p-tag {
  font-size: 0.95rem !important;
  padding: 0.5rem 1rem !important;
  border-radius: 10px !important;
  font-weight: 500 !important;
  letter-spacing: 0.01em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.preference-group .p-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.preference-group .p-tag i {
  font-size: 0.9rem !important;
  margin-right: 0.4rem;
}

/* 均衡标签布局 */
.preference-group .tags-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

/* 备注部分强化 */
.preference-group .remarks-section {
  background: var(--surface-ground);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--surface-border);
}

.preference-group .remarks-text {
  font-size: 1rem !important;
  line-height: 1.7;
  padding: 1.25rem;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .preference-group .tags-wrapper {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .preference-group .p-tag {
    font-size: 0.85rem !important;
  }
}
</style>