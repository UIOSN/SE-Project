<!-- src/views/ChatPage.vue -->
<template>
    <div class="chat-container">
      <iframe 
        src="https://udify.app/chatbot/iKCln5CX1XaRbVFw"
        class="chat-iframe"
        frameborder="0"
        allow="microphone"
      ></iframe>
    </div>
  </template>
  
  <style scoped>
  .chat-container {
    width: 100%;
    height: calc(100vh - 60px); /* 减去顶部导航栏高度 */
    padding: 0px;
  }
  
  .chat-iframe {
    width: 100%;
    height: 100%;
    min-height: 650px;
    border-radius: 12px; /* 保持与UI风格一致 */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  </style>