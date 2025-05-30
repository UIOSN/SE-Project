<script setup>
import { useToast } from 'primevue/usetoast';
import { ref, onMounted, watch } from 'vue';
import { marked } from 'marked';
import { useRoute } from 'vue-router';

const toast = useToast();
const route = useRoute();

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
const conversation_id = ref(''); // 用于跟踪会话ID

// 发送消息（支持流式显示）
// const sendMessage = async () => {
//   if (!userInput.value.trim()) {
//     toast.add({
//       severity: 'warn',
//       summary: '提示',
//       detail: '消息不能为空',
//       life: 3000
//     });
//     return;
//   }

//   // 添加用户消息
//   messages.value.push({
//     id: Date.now(),
//     text: userInput.value,
//     sender: 'user',
//     timestamp: new Date().toLocaleTimeString(),
//     severity: 'success'
//   });

//   // 调用Dify API
//   isLoading.value = true;
//   const tempMessage = {
//     id: Date.now() + 1,
//     text: '',
//     sender: 'bot',
//     timestamp: new Date().toLocaleTimeString(),
//     severity: 'info'
//   };
//   messages.value.push(tempMessage); // 添加临时消息用于流式显示

//   try {
//     const options = {
//       method: 'POST',
//       headers: {
//         Authorization: 'Bearer app-KQzeyVHErZDnb0Pv0VQvnz0L',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         inputs: { name: 'dify' },
//         query: userInput.value,
//         response_mode: 'streaming', // 设置为流式响应
//         conversation_id: conversation_id.value || '',
//         user: 'abc-123'
//       })
//     };

//     const response = await fetch('https://api.dify.ai/v1/chat-messages', options);

//     if (!response.ok) {
//       throw new Error(`API请求失败: ${response.status}`);
//     }

//     const reader = response.body.getReader();
//     const decoder = new TextDecoder('utf-8');
//     let done = false;

//     while (!done) {
//       const { value, done: readerDone } = await reader.read();
//       done = readerDone;

//       if (value) {
//         const chunk = decoder.decode(value);
//         tempMessage.text += chunk; // 更新临时消息的内容
//         // 强制触发 Vue 响应式更新
//         messages.value = [...messages.value];
//       }
//     }

//     if (conversation_id.value === '' && response.headers.get('X-Conversation-ID')) {
//       conversation_id.value = response.headers.get('X-Conversation-ID'); // 更新会话ID
//     }
//   } catch (err) {
//     console.error('API调用错误:', err);
//     toast.add({
//       severity: 'error',
//       summary: '错误',
//       detail: '获取AI回复失败: ' + err.message,
//       life: 5000
//     });
//     tempMessage.text = 'AI回复失败，请稍后重试。';
//   } finally {
//     isLoading.value = false;
//     userInput.value = '';
//   }
// };
const sendMessage = async () => {
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

  // 调用Dify API
  isLoading.value = true;
  const tempMessage = {
    id: Date.now() + 1,
    text: '',
    sender: 'bot',
    timestamp: new Date().toLocaleTimeString(),
    severity: 'info'
  };
  messages.value.push(tempMessage); // 添加临时消息用于流式显示

  try {
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer app-KQzeyVHErZDnb0Pv0VQvnz0L',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: { name: 'dify' },
        query: userInput.value,
        response_mode: 'streaming', // 设置为流式响应
        conversation_id: conversation_id.value || '',
        user: 'abc-123'
      })
    };

    const response = await fetch('https://api.dify.ai/v1/chat-messages', options);
    console.log('API响应:', response);
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;

      if (value) {
        const chunk = decoder.decode(value);
        //console.log('接收到数据块:', chunk);
        // 处理SSE格式的数据
        // 假设数据块是以 "data: " 开头的JSON字符串
        // 这里需要根据实际API返回的格式进行调整
        // 例如，如果数据块是以 "data: " 开头的JSON字符串
        const lines = chunk.split('\n');
        for (const line of lines) {
          //console.log('处理行:', line);
          if (line.startsWith('data:')) {
            const jsonData = line.replace('data:', '').trim();
            try {
              const parsedData = JSON.parse(jsonData);
              console.log('解析后的数据:', parsedData);
              if (parsedData.event === "message") {
                tempMessage.text += parsedData.answer; // 更新临时消息的内容
                messages.value = [...messages.value]; // 强制触发 Vue 响应式更新
                console.log('AI回复:', parsedData.answer);
                conversation_id.value = response.conversation_id;
                console.log("id已更新");
              }
            } catch (err) {
              console.error('解析SSE数据失败:', err);
            }
          }
        }
      }
    }

    
  } catch (err) {
    console.error('API调用错误:', err);
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '获取AI回复失败: ' + err.message,
      life: 5000
    });
    tempMessage.text = 'AI回复失败，请稍后重试。';
  } finally {
    isLoading.value = false;
    userInput.value = '';
  }
};
// 重置对话
const resetConversation = () => {
  localStorage.removeItem('chatMessages');
  localStorage.removeItem('conversationId');
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
  isLoading.value = false;
  userInput.value = '';
};

// 快捷提问
const quickQuestions = ref([
  '如何提高志愿填报成功率？',
  '生成志愿填报方案',
  '院校排名查询'
]);

const askQuickQuestion = (question) => {
  if (isLoading.value) return;
  userInput.value = question;
  sendMessage();
  userInput.value = '';
};

// 加载聊天记录和会话ID
onMounted(() => {
  const savedMessages = localStorage.getItem('chatMessages');
  if (savedMessages) {
    messages.value = JSON.parse(savedMessages);
  }

  const savedConversationId = localStorage.getItem('conversationId');
  if (savedConversationId) {
    conversation_id.value = savedConversationId;
  }
});

watch(messages, (newMessages) => {
  localStorage.setItem('chatMessages', JSON.stringify(newMessages));
}, { deep: true });

watch(conversation_id, (newConversationId) => {
  localStorage.setItem('conversationId', newConversationId);
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
              'bg-surface-100 border border-surface-200'
            ]"
          >
            <div v-if="msg.sender === 'bot'" class="flex items-start gap-3">
              <div>
                <div class="font-medium mb-1">XFeng</div>
                <Message v-if="msg.severity" :severity="msg.severity">
                  <div v-html="marked(msg.text)"></div>
                </Message>
                <template v-else>
                  <div v-html="marked(msg.text)"></div>
                </template>
                <div class="text-xs text-color-secondary mt-2">
                  {{ msg.timestamp }}
                </div>
              </div>
            </div>
            <div v-else>
              <Message v-if="msg.severity" :severity="msg.severity">
                {{ msg.text }}
              </Message>
              <div class="text-xs text-color-secondary mt-2 text-right">
                {{ msg.timestamp }}
              </div>
            </div>
          </div>
        </div>
      </transition-group>
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