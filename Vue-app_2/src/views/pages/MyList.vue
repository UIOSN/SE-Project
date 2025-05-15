<script setup>
import { ref } from 'vue';

// 模拟院校数据
const universities = ref({
  rush: [
    { id: 1, name: '清华大学', score: 695, rank: 1, chance: '20%', logo: null },
    { id: 2, name: '北京大学', score: 693, rank: 2, chance: '25%', logo: null }
  ],
  stable: [
    { id: 3, name: '复旦大学', score: 680, rank: 5, chance: '60%', logo: null },
    { id: 4, name: '上海交通大学', score: 678, rank: 6, chance: '65%', logo: null }
  ],
  safe: [
    { id: 5, name: '浙江大学', score: 670, rank: 10, chance: '85%', logo: null },
    { id: 6, name: '南京大学', score: 668, rank: 12, chance: '90%', logo:  null }
  ]
});

// 当前分数和排名输入
const userScore = ref(675);
const userRank = ref(1500);

// 操作函数
function moveUniversity(source, destination, univ) {
  const sourceIndex = universities.value[source].indexOf(univ);
  if (sourceIndex > -1) {
    universities.value[source].splice(sourceIndex, 1);
    universities.value[destination].push(univ);
  }
}

function removeUniversity(category, univ) {
  universities.value[category] = universities.value[category].filter(u => u.id !== univ.id);
}

function calculateChance(univ) {
  const scoreDiff = userScore.value - univ.score;
  const rankDiff = userRank.value - univ.rank;
  return Math.min(100, Math.max(0, 50 + scoreDiff * 5 + rankDiff * 0.1)).toFixed(0) + '%';
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 用户输入区 -->
    <div class="card p-6">
      <div class="font-semibold text-xl mb-4">我的成绩</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label for="score" class="text-surface-600 dark:text-surface-300">我的分数</label>
          <InputNumber 
            id="score" 
            v-model="userScore" 
            :min="400" 
            :max="750" 
            :step="1" 
            showButtons 
            class="w-full"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="rank" class="text-surface-600 dark:text-surface-300">我的排名</label>
          <InputNumber 
            id="rank" 
            v-model="userRank" 
            :min="1" 
            :max="50000" 
            :step="100" 
            showButtons 
            class="w-full"
          />
        </div>
      </div>
    </div>

    <!-- 志愿填报区 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 冲一冲 -->
      <div class="card">
        <div class="bg-blue-100 dark:bg-blue-900 p-4 rounded-t-lg">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-lg text-blue-800 dark:text-blue-200">冲一冲</h3>
            <Tag value="录取概率20%-40%" severity="info" />
          </div>
        </div>
        <div class="p-4">
          <DataView :value="universities.rush" layout="list">
            <template #list="slotProps">
              <div v-for="(item, index) in slotProps.items" :key="index" 
                   class="p-4 border-round border-1 surface-border mb-3">
                <div class="flex gap-4">
                  <Avatar :image="item.logo" size="large" shape="circle" />
                  <div class="flex-1">
                    <div class="font-bold">{{ item.name }}</div>
                    <div class="text-sm text-surface-500 mt-1">
                      <span>去年分数线: {{ item.score }}</span> · 
                      <span>排名: {{ item.rank }}</span>
                    </div>
                    <div class="mt-2">
                      <ProgressBar :value="parseInt(item.chance)" :showValue="false" />
                      <div class="flex justify-between text-xs mt-1">
                        <span>录取概率</span>
                        <span>{{ calculateChance(item) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex gap-2 mt-3">
                  <Button icon="pi pi-arrow-down" 
                          severity="secondary" 
                          @click="moveUniversity('rush', 'stable', item)"
                          label="降为稳妥" 
                          size="small" />
                  <Button icon="pi pi-trash" 
                          severity="danger" 
                          @click="removeUniversity('rush', item)"
                          outlined 
                          size="small" />
                </div>
              </div>
            </template>
          </DataView>
          <Button icon="pi pi-plus" label="添加冲刺院校" class="w-full mt-2" />
        </div>
      </div>

      <!-- 稳一稳 -->
      <div class="card">
        <div class="bg-green-100 dark:bg-green-900 p-4 rounded-t-lg">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-lg text-green-800 dark:text-green-200">稳一稳</h3>
            <Tag value="录取概率40%-70%" severity="success" />
          </div>
        </div>
        <div class="p-4">
          <DataView :value="universities.stable" layout="list">
            <template #list="slotProps">
              <div v-for="(item, index) in slotProps.items" :key="index" 
                   class="p-4 border-round border-1 surface-border mb-3">
                <div class="flex gap-4">
                  <Avatar :image="item.logo" size="large" shape="circle" />
                  <div class="flex-1">
                    <div class="font-bold">{{ item.name }}</div>
                    <div class="text-sm text-surface-500 mt-1">
                      <span>去年分数线: {{ item.score }}</span> · 
                      <span>排名: {{ item.rank }}</span>
                    </div>
                    <div class="mt-2">
                      <ProgressBar :value="parseInt(item.chance)" :showValue="false" />
                      <div class="flex justify-between text-xs mt-1">
                        <span>录取概率</span>
                        <span>{{ calculateChance(item) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex gap-2 mt-3">
                  <Button icon="pi pi-arrow-up" 
                          severity="secondary" 
                          @click="moveUniversity('stable', 'rush', item)"
                          label="升为冲刺" 
                          size="small" />
                  <Button icon="pi pi-arrow-down" 
                          severity="secondary" 
                          @click="moveUniversity('stable', 'safe', item)"
                          label="降为保底" 
                          size="small" />
                  <Button icon="pi pi-trash" 
                          severity="danger" 
                          @click="removeUniversity('stable', item)"
                          outlined 
                          size="small" />
                </div>
              </div>
            </template>
          </DataView>
          <Button icon="pi pi-plus" label="添加稳妥院校" class="w-full mt-2" />
        </div>
      </div>

      <!-- 保一保 -->
      <div class="card">
        <div class="bg-orange-100 dark:bg-orange-900 p-4 rounded-t-lg">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-lg text-orange-800 dark:text-orange-200">保一保</h3>
            <Tag value="录取概率70%+" severity="warn" />
          </div>
        </div>
        <div class="p-4">
          <DataView :value="universities.safe" layout="list">
            <template #list="slotProps">
              <div v-for="(item, index) in slotProps.items" :key="index" 
                   class="p-4 border-round border-1 surface-border mb-3">
                <div class="flex gap-4">
                  <Avatar :image="item.logo" size="large" shape="circle" />
                  <div class="flex-1">
                    <div class="font-bold">{{ item.name }}</div>
                    <div class="text-sm text-surface-500 mt-1">
                      <span>去年分数线: {{ item.score }}</span> · 
                      <span>排名: {{ item.rank }}</span>
                    </div>
                    <div class="mt-2">
                      <ProgressBar :value="parseInt(item.chance)" :showValue="false" />
                      <div class="flex justify-between text-xs mt-1">
                        <span>录取概率</span>
                        <span>{{ calculateChance(item) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex gap-2 mt-3">
                  <Button icon="pi pi-arrow-up" 
                          severity="secondary" 
                          @click="moveUniversity('safe', 'stable', item)"
                          label="升为稳妥" 
                          size="small" />
                  <Button icon="pi pi-trash" 
                          severity="danger" 
                          @click="removeUniversity('safe', item)"
                          outlined 
                          size="small" />
                </div>
              </div>
            </template>
          </DataView>
          <Button icon="pi pi-plus" label="添加保底院校" class="w-full mt-2" />
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="card p-4 flex justify-end gap-3">
      <Button icon="pi pi-save" label="保存志愿表" severity="info" />
      <Button icon="pi pi-print" label="打印志愿表" severity="secondary" />
      <Button icon="pi pi-check" label="提交志愿" severity="success" />
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