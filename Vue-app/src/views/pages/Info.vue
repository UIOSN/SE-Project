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
  { name: '上海', code: 'SH' },
  { name: '广东', code: 'GD' },
  { name: '江苏', code: 'JS' },
  { name: '浙江', code: 'ZJ' }
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
  { name: '临床医学', code: 'MED' },
  { name: '金融学', code: 'FIN' },
  { name: '法学', code: 'LAW' },
  { name: '电子信息工程', code: 'EE' },
  { name: '工商管理', code: 'BM' }
]);

const handleSubmit = async () => {
  const { region, selectedSubjects, score, rank } = formData.value;

  // 映射选科组合的 code 到 name
  const selectedSubjectNames = selectedSubjects.map(code => {
    const subject = subjects.value.find(subject => subject.code === code);
    return subject ? subject.name : code; // 如果找不到，保留原始 code
  });

  // 映射地区的 code 到 name
  const regionName = regions.value.find(r => r.code === region)?.name || '未填写';

//映射专业的 code 到 name
  const preferredMajors = formData.value.preferredMajors.map(code => {
    const major = majors.value.find(major => major.code === code);
    return major ? major.name : code; // 如果找不到，保留原始 code
  });
const preferredRegions = formData.value.preferredRegions.map(code => {
    const region = regions.value.find(region => region.code === code);
    return region ? region.name : code; // 如果找不到，保留原始 code
  });
  // 确保字段值有效
  const validSubjects = selectedSubjectNames.length > 0 ? selectedSubjectNames.join('+') : '未选择';
  const validScore = score !== null ? score : '未填写';
  const validRank = rank !== null ? rank : '未填写';

  const prompt = `生源地: ${regionName}, 选科组合: ${validSubjects}, 高考分数: ${validScore}, 省排名: ${validRank},
    考生类型: ${formData.value.isArtStudent ? '文科/历史类' : '理科/物理类'}, ` +
    `意向专业: ${preferredMajors.join(', ')}, ` +
    `意向地区: ${preferredRegions.join(', ') || '未选择'}, ` +
    `备注信息: ${formData.value.remarks || '无'}`;
  console.log('生成的Prompt:', prompt);

  try {
    // const options = {
    //   method: 'POST',
    //   headers: {
    //     Authorization: 'Bearer app-KQzeyVHErZDnb0Pv0VQvnz0L',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     inputs: { name: "dify" },
    //     query: prompt,
    //     response_mode: "blocking",
    //     user: "abc-123"
    //   })
    // };

    // const response = await fetch('https://api.dify.ai/v1/chat-messages', options);

    // if (!response.ok) {
    //   throw new Error(`API请求失败: ${response.status}`);
    // }

    // const data = await response.json();
    // console.log('API返回数据:', data);

    // toast.add({
    //   severity: 'success',
    //   summary: '成功',
    //   detail: '志愿填报方案生成成功！',
    //   life: 3000
    // });

    // 在API调用成功后跳转到Chat页面
    router.push({
      path: '/chat',
      query: {
        prompt: prompt, // 将Prompt作为查询参数传递
      }
    });
    console.log('跳转到Chat页面，生成的Prompt:', prompt);
  } catch (err) {
    console.error('API调用错误:', err);
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '生成志愿填报方案失败: ' + err.message,
      life: 5000
    });
  }
};
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
