<script setup>
import { ref } from 'vue';

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

// 选项数据
const regions = ref([
  { name: '北京', code: 'BJ' },
  { name: '上海', code: 'SH' },
  { name: '广东', code: 'GD' },
  { name: '江苏', code: 'JS' },
  { name: '浙江', code: 'ZJ' }
]);

const subjects = ref([
  { name: '语文', code: 'YW' },
  { name: '数学', code: 'SX' },
  { name: '英语', code: 'YY' },
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

// 提交处理
const handleSubmit = () => {
  console.log('提交的学生信息:', formData.value);
  // 这里可以添加API调用等提交逻辑
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
          <InputText type="text" placeholder="考生姓名" />
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
      <Button 
        label="提交信息" 
        icon="pi pi-check" 
        @click="handleSubmit"
        class="w-full md:w-auto"
      />
    </div>
  </div>
</template>