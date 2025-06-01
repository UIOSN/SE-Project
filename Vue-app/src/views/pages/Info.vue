<script setup>
import { ref ,onMounted,watch} from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();
const conversationId = ref(''); // 用于跟踪会话ID
// 表单数据

const formData = ref({
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


// 加载表单数据
onMounted(() => {
  const savedData = localStorage.getItem('formData');
  if (savedData) {
    formData.value = JSON.parse(savedData); // 从 localStorage 加载数据
  }
});

// 监听表单数据变化并保存到 localStorage
watch(formData, (newValue) => {
  localStorage.setItem('formData', JSON.stringify(newValue)); // 保存数据到 localStorage
}, { deep: true });

// 选项数据
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

const handleSubmit = async () => {
  // 表单验证
  if (!formData.value.name || !formData.value.score || !formData.value.region) {
    toast.add({
      severity: 'error',
      summary: '验证失败',
      detail: '请填写必填字段：姓名、分数、地区',
      life: 3000
    });
    return;
  }

  try {
    // 获取用户token
    const token = localStorage.getItem('token');
    if (!token) {
      toast.add({
        severity: 'error',
        summary: '未登录',
        detail: '请先登录后再填写信息',
        life: 3000
      });
      router.push('/auth/login');
      return;
    }

    // 提交到后端API
    const response = await fetch('http://localhost:3000/api/user/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: formData.value.name,
        score: formData.value.score,
        region: formData.value.region,
        rank: formData.value.rank,
        selectedSubjects: formData.value.selectedSubjects,
        preferredMajors: formData.value.preferredMajors,
        preferredRegions: formData.value.preferredRegions,
        isArtStudent: formData.value.isArtStudent,
        remarks: formData.value.remarks
      })
    });

    const result = await response.json();

    if (result.success) {
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '信息保存成功！',
        life: 3000
      });

      // 仍保存到localStorage作为备份
      localStorage.setItem('formData', JSON.stringify(formData.value));

      // 生成AI提示词并跳转到Chat页面
      const prompt = generatePrompt();
      router.push({
        path: '/chat',
        query: { prompt: prompt }
      });
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('提交失败:', error);
    toast.add({
      severity: 'error',
      summary: '提交失败',
      detail: error.message || '网络错误，请重试',
      life: 3000
    });
  }
};

// 生成AI提示词的辅助函数
const generatePrompt = () => {
  const { region, selectedSubjects, score, rank } = formData.value;

  // 映射选科组合的 code 到 name
  const selectedSubjectNames = selectedSubjects.map(code => {
    const subject = subjects.value.find(subject => subject.code === code);
    return subject ? subject.name : code;
  });

  // 映射地区的 code 到 name
  const regionName = regions.value.find(r => r.code === region)?.name || '未填写';

  // 映射专业的 code 到 name
  const preferredMajors = formData.value.preferredMajors.map(code => {
    const major = majors.value.find(major => major.code === code);
    return major ? major.name : code;
  });

  const preferredRegions = formData.value.preferredRegions.map(code => {
    const region = regions.value.find(region => region.code === code);
    return region ? region.name : code;
  });

  // 确保字段值有效
  const validSubjects = selectedSubjectNames.length > 0 ? selectedSubjectNames.join('+') : '未选择';
  const validScore = score !== null ? score : '未填写';
  const validRank = rank !== null ? rank : '未填写';

  return `生源地: ${regionName}, 选科组合: ${validSubjects}, 高考分数: ${validScore}, 省排名: ${validRank},
    考生类型: ${formData.value.isArtStudent ? '文科/历史类' : '理科/物理类'}, ` +
    `意向专业: ${preferredMajors.join(', ')}, ` +
    `意向地区: ${preferredRegions.join(', ') || '未选择'}, ` +
    `备注信息: ${formData.value.remarks || '无'}`;
};

// 在组件挂载时从数据库读取信息
onMounted(async () => {
  // 首先尝试从数据库读取
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await fetch('http://localhost:3000/api/user/info', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        formData.value = result.data;
        return; // 如果从数据库读取成功，就不需要从localStorage读取了
      }
    }
  } catch (error) {
    console.error('从数据库读取信息失败:', error);
  }

  // 如果数据库读取失败，从localStorage读取备份
  const savedData = localStorage.getItem('formData');
  if (savedData) {
    formData.value = JSON.parse(savedData);
  }
});
</script>

<template>
  <div class="card flex flex-col gap-6 p-6">
    <h2 class="text-2xl font-bold mb-4">完善您的信息！</h2>
    
    <!-- 基本信息 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- <FloatLabel>
        <InputIcon class="pi pi-user" />
        <InputText id="name" type="text" v-model="formData.name" />
        
        <label for="name">学生姓名</label>
      </FloatLabel> -->
      <IconField>
          <InputIcon class="pi pi-user" />
          <!-- <InputText type="text" placeholder="考生姓名" /> -->
          <InputText id="name" type="text" v-model="formData.name" placeholder="考生姓名" />

      </IconField>
      
      <FloatLabel>
        <InputNumber 
          id="score" 
          v-model="formData.score" 
          mode="decimal" 
          :min="0" 
          :max="750" 
          showButtons
        />
        <label for="score">高考总分</label>
      </FloatLabel>
    </div>
    
    <!-- 地区选择 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-7">
      <div>
        <!-- <label class="block font-medium mb-2">所在地区</label> -->
        <Dropdown 
          v-model="formData.region" 
          :options="regions" 
          optionValue="code"
          optionLabel="name" 
          placeholder="请选择地区"
          class="w-full"
        />
      </div>
      
      <FloatLabel>
        <InputNumber 
          id="rank" 
          v-model="formData.rank" 
          mode="decimal" 
          :min="1" 
          showButtons
        />
        <label for="rank">所在地区排名</label>
      </FloatLabel>
    </div>
    
    <!-- 选科情况 -->
    <div>
      <label class="block font-medium mb-2">选考科目</label>
      <div class="flex flex-wrap gap-4">
        <div v-for="subject in subjects" :key="subject.code" class="flex items-center">
          <Checkbox 
            v-model="formData.selectedSubjects" 
            :value="subject.code" 
            :inputId="'subject_' + subject.code"
          />
          <label :for="'subject_' + subject.code" class="ml-2">{{ subject.name }}</label>
        </div>
      </div>
    </div>
    
    <!-- 文理科 -->
    <div>
      <label class="block font-medium mb-2">考生类型</label>
      <SelectButton 
        v-model="formData.isArtStudent" 
        :options="[
          { label: '理科/物理类', value: false },
          { label: '文科/历史类', value: true }
        ]" 
        optionLabel="label"
        optionValue="value"
      />
    </div>
    
    <!-- 意向信息 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block font-medium mb-2">意向专业</label>
        <MultiSelect 
          v-model="formData.preferredMajors" 
          :options="majors" 
          optionLabel="name" 
          optionValue="code"
          placeholder="请选择专业"
          display="chip"
          class="w-full"
        />
      </div>
      
      <div>
        <label class="block font-medium mb-2">意向地区</label>
        <MultiSelect 
          v-model="formData.preferredRegions" 
          :options="regions" 
          optionLabel="name" 
          optionValue="code"
          placeholder="请选择地区"
          display="chip"
          class="w-full"
        />
      </div>
    </div>
    
    <!-- 备注 -->
    <div>
      <label class="block font-medium mb-2">备注信息</label>
      <Textarea 
        v-model="formData.remarks" 
        placeholder="请输入其他需要说明的信息" 
        :autoResize="true" 
        rows="5"
        class = "w-full"
      />
    </div>
    
    <!-- 提交按钮 -->
    <div class="flex justify-end mt-4">
      <!-- <router-link to = "/chat"> -->
        <Button 
          label="一键生成志愿填报方案" 
          icon="pi pi-check" 
          @click="handleSubmit"
          class="w-full md:w-auto"
        />
      <!-- </router-link> -->
    </div>
  </div>
</template>
