<script setup>
import { useToast } from 'primevue/usetoast';
import { ref,onMounted,watch } from 'vue';
import {marked} from 'marked';
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

const route = useRoute();
// 如果需要持久化会话，可以在这里初始化conversation_id

const conversation_id = ref(''); // 用于跟踪会话ID
// 发送消息（已接入Dify API）
const sendMessage = async () => {
  if (!userInput.value.trim() && messages.value.length == 0) {
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
  try {
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer app-KQzeyVHErZDnb0Pv0VQvnz0L',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: { name: "dify" },
        query: userInput.value,
        response_mode: "blocking",
        conversation_id: conversation_id.value || '', // 如果有会话ID则使用
        user: "abc-123"
      })
    };

    const response = await fetch('https://api.dify.ai/v1/chat-messages', options);
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    if(data.conversation_id) {
      conversation_id.value = data.conversation_id; // 更新会话ID
    }
    // 添加AI回复
    messages.value.push({
      id: Date.now() + 1,
      text: data.answer || "收到回复但内容为空", // 根据实际API响应结构调整
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
      severity: 'info'
    });
    console.log('AI回复:', data.answer);
  } catch (err) {
    console.error('API调用错误:', err);
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '获取AI回复失败: ' + err.message,
      life: 5000
    });
  } finally {
    isLoading.value = false;
    userInput.value = '';
  }
};
const resetConversation = () => {
  // 清除聊天记录和会话ID
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
  conversation_id.value = ''; // 重置会话ID
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '已重新开始对话',
    life: 3000
  });
  isLoading.value = false; // 重置加载状态
  userInput.value = ''; // 清空用户输入
};

if (route.query.prompt) {
  resetConversation(); // 重置对话以清除旧消息
  console.log('Route prompt detected:', route.query.prompt); // Debugging log
  // console.log('Route query detected:', route.query); // Debugging log
  // conversation_id.value = route.query.conversationId || ''; // 如果有会话ID则使用
  // console.log('Conversation ID:', conversation_id.value); // Debugging log
  userInput.value = route.query.prompt; // 设置用户输入为路由参数中的prompt
  sendMessage(); // 发送用户信息作为第一条消息

  // messages.value.push({
  //   id: Date.now() + 1,
  //   text: route.query.answer,
  //   sender: 'bot',
  //   timestamp: new Date().toLocaleTimeString(),
  //   severity: 'info'
  // });
} else {
  console.log('Route prompt is missing or incomplete:', route.query.prompt); // Debugging log
}


const showLeaveDialog = ref(false);
let pendingNavigation = null;

const cancelLeave = () => {
  showLeaveDialog.value = false;
  pendingNavigation = null; // 清除挂起的导航
};

const confirmLeave = () => {
  showLeaveDialog.value = false;
  if (pendingNavigation) {
    pendingNavigation(); // 执行挂起的导航
  }
};

onBeforeRouteLeave((to, from, next) => {
  console.log('onBeforeRouteLeave triggered'); // Debugging log
  if (isLoading.value) {
    showLeaveDialog.value = true;
    console.log('Navigation pending, showing dialog'); // Debugging log
    pendingNavigation = next; // 挂起导航，等待用户确认
    console.log("showleaveDialog.value:", showLeaveDialog.value); // Debugging log
  } else {
    next(); // 如果没有正在加载，直接跳转
  }
});
onMounted(() => {
  // 加载聊天记录
  const savedMessages = localStorage.getItem('chatMessages');
  if (savedMessages) {
    messages.value = JSON.parse(savedMessages); // 从 localStorage 加载聊天记录
  }

  // 加载 conversation_id
  const savedConversationId = localStorage.getItem('conversationId');
  if (savedConversationId) {
    conversation_id.value = savedConversationId; // 从 localStorage 加载会话ID
  }
});

watch(messages, (newMessages) => {
  localStorage.setItem('chatMessages', JSON.stringify(newMessages)); // 保存聊天记录到 localStorage
}, { deep: true });

watch(conversation_id, (newConversationId) => {
  localStorage.setItem('conversationId', newConversationId); // 保存会话ID到 localStorage
});


// 快捷提问
const quickQuestions = ref([
  '如何提高志愿填报成功率？',
  '生成志愿填报方案',
  '院校排名查询'
]);

const askQuickQuestion = (question) => {
  if(isLoading.value) return; // 如果正在加载则不处理
  userInput.value = question;
  sendMessage();
  userInput.value = '';
};
</script>

<template>
  <!-- 以下模板部分保持不变 -->
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
              'max-w-[80%] p-4 rounded-lg','bg-surface-100 border border-surface-200'
            ]"
          >
            <!-- AI消息带图标 -->
            <div v-if="msg.sender === 'bot'" class="flex items-start gap-3">
              <!-- <Avatar 
                icon="pi pi-robot" 
                size="large" 
                shape="circle"
                class="bg-blue-500 text-white"
              /> -->
              <div>
                <div class="font-medium mb-1">XFeng</div>
                <Message v-if="msg.severity" :severity="msg.severity">
                  <!-- {{ msg.text }} -->
                  <div v-html="marked(msg.text)"></div>
                </Message>
                <template v-else>
                  <!-- {{ msg.text }} -->
                  <div v-html="marked(msg.text)"></div>
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
    :loading = "isLoading"
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
  <!-- 离开确认对话框 -->
  <!-- <div v-if="showLeaveDialog" class="modal"> -->
  <!-- <div class="modal-content">
    <h3>确认离开</h3>
    <p>信息正在生成中，离开会导致信息停止。您确定要离开吗？</p>
    <button @click="cancelLeave">留下</button>
    <button @click="confirmLeave">确认离开</button>
  </div> -->

</template>

<style scoped>
/* 保持原有样式不变 */
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