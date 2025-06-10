<template>
    <div class="card">
        <div class="font-semibold text-2xl mb-6">如何使用？</div>
        
        <!-- 注册登录 -->
        <div class="font-semibold text-xl mb-4 flex items-center">
            <span class="bg-primary-100 text-primary-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
            注册登录
        </div>
        <p class="text-lg mb-4">
            访问系统后，点击右上角 <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">登录/注册</span> 按钮，可通过以下方式完成注册：
        </p>
        <ul class="leading-normal list-disc pl-8 text-lg mb-6">
            <li>手机号/邮箱注册</li>
            
        </ul>
        <div class="border-l-4 border-primary-500 bg-surface-100 dark:bg-surface-700 p-4 mb-6 rounded-r">
            <i class="pi pi-info-circle text-primary-500 mr-2"></i>
            首次使用需完成手机号绑定，确保后续志愿表修改通知能及时接收
        </div>

        <!-- 填写考生信息 -->
        <div class="font-semibold text-xl mb-4 flex items-center">
            <span class="bg-primary-100 text-primary-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
            填写考生信息
        </div>
        <p class="text-lg mb-4">
            登录后进入 <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">考生信息</span> 页面，需准确填写：
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="border rounded-lg p-4">
                <div class="flex items-center mb-2">
                    <i class="pi pi-id-card text-primary-500 mr-2"></i>
                    <span class="font-medium">基本信息</span>
                </div>
                <ul class="text-surface-600 dark:text-surface-300 pl-4">
                    <li class="mb-1">• 真实姓名与准考证一致</li>
                    <li class="mb-1">• 选择正确科类（物理/历史）</li>
                    <li>• 准确填写选考科目</li>
                </ul>
            </div>
            <div class="border rounded-lg p-4">
                <div class="flex items-center mb-2">
                    <i class="pi pi-star text-primary-500 mr-2"></i>
                    <span class="font-medium">成绩信息</span>
                </div>
                <ul class="text-surface-600 dark:text-surface-300 pl-4">
                    <li class="mb-1">• 高考总分及各科成绩</li>
                    <li class="mb-1">• 全省排名（位次）</li>
                    <li>• 外语语种及口语成绩</li>
                </ul>
            </div>
        </div>

        <!-- 生成志愿方案 -->
        <div class="font-semibold text-xl mb-4 flex items-center">
            <span class="bg-primary-100 text-primary-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
            生成志愿填报方案
        </div>
        <p class="text-lg mb-4">
            系统将基于百万条录取数据，通过AI算法生成 <span class="text-primary font-medium">冲、稳、保</span> 三档志愿方案：
        </p>
        <div class="flex flex-col md:flex-row gap-4 mb-6">
            <div v-for="(item,index) in strategyTypes" :key="index" 
                 class="border rounded-lg p-4 flex-1" 
                 :class="{'border-primary-500': index === 0, 'border-green-500': index === 1, 'border-orange-500': index === 2}">
                <div class="flex items-center mb-2">
                    <i :class="item.icon" class="mr-2" :style="{color: item.color}"></i>
                    <span class="font-medium" :style="{color: item.color}">{{item.title}}</span>
                </div>
                <p class="text-surface-600 dark:text-surface-300">{{item.desc}}</p>
            </div>
        </div>
      


        <!-- 填写志愿表 -->
        <div class="font-semibold text-xl mb-4 flex items-center">
            <span class="bg-primary-100 text-primary-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
            填写志愿表
        </div>
        <p class="text-lg mb-4">
            在 <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">志愿表管理</span> 页面，您可以：
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div v-for="(action,index) in actions" :key="index" 
                 class="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                <div class="flex items-center mb-2">
                    <i :class="action.icon" class="text-primary-500 mr-2"></i>
                    <span class="font-medium">{{action.title}}</span>
                </div>
                <p class="text-surface-600 dark:text-surface-300">{{action.desc}}</p>
            </div>
        </div>

        <!-- 院校详情 -->
        <div class="font-semibold text-xl mb-4 flex items-center">
            <i class="pi pi-book text-primary-500 mr-3 text-2xl"></i>
            院校详情信息
        </div>
        <p class="text-lg mb-4">
            点击任意院校名称，可查看完整院校档案：
        </p>
        <div class="border rounded-lg overflow-hidden mb-6">
            <div class="grid grid-cols-4 bg-surface-100 dark:bg-surface-800 p-3 font-medium">
                <div>信息类别</div>
                <div class="col-span-3">包含内容</div>
            </div>
            <div v-for="(detail,index) in schoolDetails" :key="index" 
                 class="grid grid-cols-4 p-3 border-t hover:bg-surface-50 dark:hover:bg-surface-700">
                <div class="text-primary-500 font-medium">{{detail.category}}</div>
                <div class="col-span-3 text-surface-600 dark:text-surface-300">{{detail.content}}</div>
            </div>
        </div>

        <div class="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
            <div class="flex items-start">
                <i class="pi pi-question-circle text-blue-500 text-2xl mr-3 mt-1"></i>
                <div>
                    <h4 class="font-semibold text-lg mb-2">需要帮助？</h4>
                    
                    <p>2. 联系客服 <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">minrb@mail2.sysu.edu.cn</span></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const strategyTypes = [
  {
    title: '冲刺院校',
    desc: '录取概率40%-60%，适合冲击更高层次院校',
    icon: 'pi pi-arrow-up',
    color: '#3B82F6'
  },
  {
    title: '稳妥院校',
    desc: '录取概率60%-80%，最匹配考生成绩的院校',
    icon: 'pi pi-check-circle',
    color: '#10B981'
  },
  {
    title: '保底院校',
    desc: '录取概率80%-95%，确保不会滑档的院校',
    icon: 'pi pi-shield',
    color: '#F59E0B'
  }
];

const actions = [
  {
    title: '智能排序',
    desc: '根据录取概率自动优化志愿顺序',
    icon: 'pi pi-sort-alt'
  },
  {
    title: '手动调整',
    desc: '拖动院校调整顺序，自定义志愿表',
    icon: 'pi pi-bars'
  },
  {
    title: '导出打印',
    desc: '生成PDF格式志愿表，方便提交',
    icon: 'pi pi-download'
  }
];

const schoolDetails = [
  {
    category: '基本信息',
    content: '院校层次、所在地、招生代码、院校属性（985/211/双一流）'
  },
  {
    category: '招生计划',
    content: '各专业招生人数、选科要求、学费标准'
  },
  {
    category: '录取数据',
    content: '近3年最低分/位次、专业录取分、分数变化趋势图'
  },
  {
    category: '就业情况',
    content: '毕业生就业率、主要就业行业、典型就业单位'
  },
  {
    category: '校园生活',
    content: '宿舍条件、校园风光、特色社团活动'
  }
];
</script>

<style scoped>
.rounded-border {
    border-radius: 4px;
}

.app-code {
    @apply bg-surface-900 text-white p-4 rounded-lg overflow-auto;
    font-family: monospace;
    white-space: pre;
}

.app-code code {
    @apply block;
}
</style>