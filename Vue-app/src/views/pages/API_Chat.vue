<script setup>
import { useToast } from 'primevue/usetoast';
import { ref, onMounted, watch, nextTick } from 'vue';
import { marked } from 'marked';
import { useRoute, onBeforeRouteLeave } from 'vue-router';

const toast = useToast();
const messages = ref([
  { 
    id: 1,
    text: '您好！我是高考政策咨询助手，专注于解答高考政策疑问，并提供志愿填报建议。为了给您更精准的帮助，请告诉我您的生源地（省市）、选科组合（如物理+化学+生物）、预计高考分数，以及大概的省排名区间。随时为您答疑！', 
    sender: 'bot',
    timestamp: new Date().toLocaleTimeString(),
    severity: 'info'
  }
]);
const userInput = ref('');
const isLoading = ref(false);
const conversation_id = ref('');
const route = useRoute();

// 发送消息（流式版本）
const sendMessage = async () => {
  if (!userInput.value.trim()) {
    toast.add({ severity: 'warn', summary: '提示', detail: '消息不能为空', life: 3000 });
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

  // 创建AI消息占位
  const botMessageId = Date.now() + 1;
  const botMessage = {
    id: botMessageId,
    text: '...', // 流式加载光标
    sender: 'bot',
    timestamp: new Date().toLocaleTimeString(),
    severity: 'info',
    isStreaming: true
  };
  messages.value.push(botMessage);
  
  isLoading.value = true;
  const currentInput = userInput.value;
  userInput.value = '';

  try {
    const response = await fetch('http://localhost:3000/api/chat-stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: currentInput,
        conversation_id: conversation_id.value
      })
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      
      // 处理可能不完整的最后一行
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data:')) {
          try {
            const data = JSON.parse(line.substring(5).trim());
            if (data.answer) {
              fullText += data.answer;
              console.log('流式数据:', data.answer);
              // 更新最后一条消息内容
              const msgIndex = messages.value.findIndex(m => m.id === botMessageId);
              if (msgIndex !== -1) {
                messages.value[msgIndex].text = marked(fullText) + '▌';
                scrollToBottom();
              }
            }
            if (data.conversation_id) {
              conversation_id.value = data.conversation_id;
            }
          } catch (e) {
            console.error('解析SSE数据失败:', e);
          }
        }
      }
    }

    // 流式结束，移除光标
    const msgIndex = messages.value.findIndex(m => m.id === botMessageId);
    if (msgIndex !== -1) {
      messages.value[msgIndex].text = marked(fullText);
      delete messages.value[msgIndex].isStreaming;
    }
  } catch (err) {
    console.error('流式请求失败:', err);
    const msgIndex = messages.value.findIndex(m => m.id === botMessageId);
    if (msgIndex !== -1) {
      messages.value[msgIndex].text = '回复生成失败: ' + err.message;
    }
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '获取AI回复失败',
      life: 5000
    });
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
};

// 自动滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    const container = document.querySelector('.overflow-y-auto');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  });
};

// 快捷提问
const quickQuestions = ref([
  '生成志愿填报方案',
  '如何提高志愿填报成功率？',
  '院校信息查询'
]);

const askQuickQuestion = (question) => {
  if (isLoading.value) return;
  userInput.value = question;
  sendMessage();
};

// 重置对话
const resetConversation = () => {
  messages.value = [
    {
      id: 1,
      text: '您好！我是高考政策咨询助手，专注于解答高考政策疑问，并提供志愿填报建议。为了给您更精准的帮助，请告诉我您的生源地（省市）、选科组合（如物理+化学+生物）、预计高考分数，以及大概的省排名区间。随时为您答疑！',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
      severity: 'info'
    }
  ];
  conversation_id.value = '';
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '已重新开始对话',
    life: 3000
  });
};

// 路由提示处理（保持你原来的逻辑）
const showLeaveDialog = ref(false);
let pendingNavigation = null;

onBeforeRouteLeave((to, from, next) => {
  if (isLoading.value) {
    showLeaveDialog.value = true;
    pendingNavigation = next;
  } else {
    next();
  }
});

// 加载本地存储的数据
onMounted(() => {
  const savedMessages = localStorage.getItem('chatMessages');
  if (savedMessages) {
    messages.value = JSON.parse(savedMessages);
  }

  const savedConversationId = localStorage.getItem('conversationId');
  if (savedConversationId) {
    conversation_id.value = savedConversationId;
  }

  if (route.query.prompt) {
    userInput.value = route.query.prompt;
    sendMessage();
  }
});

// 监听数据变化保存到本地
watch(messages, (newMessages) => {
  localStorage.setItem('chatMessages', JSON.stringify(newMessages));
}, { deep: true });

watch(conversation_id, (newId) => {
  localStorage.setItem('conversationId', newId);
});
</script>

<template>
  <div class="card flex flex-col gap-6 h-[110vh]">
    <!-- 标题区 -->
    <div class="flex justify-between items-center border-b pb-4">
      <div class="font-semibold text-2xl">张小峰</div>
      <Button 
        icon="pi pi-refresh" 
        severity="secondary" 
        outlined 
        aria-label="重置对话"
        @click="resetConversation"
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
              'max-w-[80%] p-4 rounded-lg',
              msg.sender === 'user' 
                ? ' border-primary-200' 
                : 'bg-surface-100 border-surface-200'
            ]"
          >
            <!-- AI消息 -->
            <div v-if="msg.sender === 'bot'" class="flex items-start gap-3">
              <div>
                <div class="font-medium mb-1">XFeng</div>
                <Message v-if="msg.severity" :severity="msg.severity">
                  <div v-html="msg.text"></div>
                </Message>
                <div v-else v-html="msg.text"></div>
                <div class="text-xs text-color-secondary mt-2">
                  {{ msg.timestamp }}
                </div>
              </div>
            </div>

            <!-- 用户消息 -->
            <div v-else>
              <!-- <div class="text-right font-medium mb-1">You</div> -->
              <Message :severity="msg.severity">
                {{ msg.text }}
              </Message>
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
            <span>正在思考中...</span>
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
        :disabled="isLoading" 
        :class="[
          'cursor-pointer',
          isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-200'
        ]"
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
          :disabled="isLoading"
        />
        <Button 
          icon="pi pi-send" 
          label="发送" 
          @click="sendMessage"
          :loading="isLoading"
          :disabled="isLoading"
        />
      </div>
    </div>

    <!-- 离开确认对话框 -->
    <Dialog 
      v-model:visible="showLeaveDialog" 
      header="提示" 
      :modal="true"
      :dismissableMask="true"
    >
      <div class="flex flex-col gap-3">
        <p>正在生成回复，确定要离开吗？</p>
        <div class="flex justify-end gap-2">
          <Button label="取消" @click="showLeaveDialog = false" />
          <Button 
            label="确定离开" 
            severity="danger" 
            @click="() => { showLeaveDialog = false; pendingNavigation?.(); }" 
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.chat-message-enter-active,
.chat-message-leave-active {
  transition: all 0.3s ease;
}
.chat-message-enter-from,
.chat-message-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.card {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  padding: 1.5rem;
}

/* 流式消息光标动画 */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

:deep(.message-streaming::after) {
  content: '▌';
  animation: blink 1s infinite;
  display: inline-block;
  margin-left: 2px;
}
</style>