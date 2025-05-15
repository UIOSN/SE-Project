<script setup>
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

const toast = useToast();
const messages = ref([
  { 
    id: 1,
    text: '您好！我是AI助手，请问有什么可以帮您？', 
    sender: 'bot',
    timestamp: new Date().toLocaleTimeString(),
    severity: 'info'
  }
]);
const userInput = ref('');
const isLoading = ref(false);

// 发送消息
const sendMessage = () => {
  if (!userInput.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: '提示',
      detail: '消息不能为空',
      life: 3000
    });
    return;
  }

  // 添加用户消息
  messages.value.push({
    id: Date.now(),
    text: userInput.value,
    sender: 'user',
    timestamp: new Date().toLocaleTimeString(),
    severity: 'success'
  });

  // 模拟AI回复
  isLoading.value = true;
  setTimeout(() => {
    messages.value.push({
      id: Date.now() + 1,
      text: '这是一个模拟回复。实际项目中这里会调用AI API。',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
      severity: 'info'
    });
    isLoading.value = false;
  }, 1500);

  userInput.value = '';
};

// 快捷提问
const quickQuestions = ref([
  '如何提高志愿填报成功率？',
  '推荐适合我的专业',
  '院校排名查询'
]);

const askQuickQuestion = (question) => {
  userInput.value = question;
  sendMessage();
};
</script>

<template>
  <div class="card flex flex-col gap-6 h-[110vh]">
    <!-- 标题区 -->
    <div class="flex justify-between items-center border-b pb-4">
      <div class="font-semibold text-2xl">张小峰</div>
      <Button 
        icon="pi pi-cog" 
        severity="secondary" 
        outlined 
        aria-label="设置"
      />
    </div>

    <!-- 消息展示区 -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <transition-group name="chat-message" tag="div">
        <div 
          v-for="msg in messages" 
          :key="msg.id"
          :class="[
            'flex',
            msg.sender === 'user' ? 'justify-end' : 'justify-start'
          ]"
        >
          <div 
            :class="[
              'max-w-[80%] p-4 rounded-lg','bg-surface-100 border border-surface-200'
            ]"
          >
            <!-- AI消息带图标 -->
            <div v-if="msg.sender === 'bot'" class="flex items-start gap-3">
              <Avatar 
                icon="pi pi-robot" 
                size="large" 
                shape="circle"
                class="bg-blue-500 text-white"
              />
              <div>
                <div class="font-medium mb-1">AI助手</div>
                <Message v-if="msg.severity" :severity="msg.severity">
                  {{ msg.text }}
                </Message>
                <template v-else>
                  {{ msg.text }}
                </template>
                <div class="text-xs text-color-secondary mt-2">
                  {{ msg.timestamp }}
                </div>
              </div>
            </div>

            <!-- 用户消息 -->
            <div v-else>
              <div class="text-right font-medium mb-1"></div>
              <Message v-if="msg.severity" :severity="msg.severity">
                  {{ msg.text }}
                </Message>
              <!-- <div>{{ msg.text }}</div> -->
              <div class="text-xs text-color-secondary mt-2 text-right">
                {{ msg.timestamp }}
              </div>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex justify-start">
        <div class="max-w-[80%] p-4 rounded-lg bg-surface-100 border border-surface-200">
          <div class="flex items-center gap-2">
            <ProgressSpinner style="width: 20px; height: 20px" />
            <span>AI正在思考中...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷提问 -->
    <div class="flex flex-wrap gap-2">
      <Chip 
        v-for="(question, index) in quickQuestions" 
        :key="index"
        :label="question"
        @click="askQuickQuestion(question)"
        class="cursor-pointer hover:bg-surface-200"
      />
    </div>

    <!-- 输入区 -->
    <div class="border-t pt-4">
      <div class="flex gap-2">
        <InputText 
          v-model="userInput" 
          placeholder="输入您的问题..." 
          class="flex-1"
          @keyup.enter="sendMessage"
        />
        <Button 
          icon="pi pi-send" 
          label="发送" 
          @click="sendMessage"
          :loading="isLoading"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 消息动画 */
.chat-message-enter-active,
.chat-message-leave-active {
  transition: all 0.3s ease;
}
.chat-message-enter-from,
.chat-message-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 保持与原有UI一致的卡片样式 */
.card {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  padding: 1.5rem;
}

/* 消息气泡样式 */
.bg-surface-100 {
  background: var(--surface-100);
}
.bg-primary {
  background: var(--primary-color);
}
.text-primary-contrast {
  color: var(--primary-color-text);
}
</style>