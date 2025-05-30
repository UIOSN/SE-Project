const options = {
    method: 'POST',
    headers: {Authorization: 'Bearer app-KQzeyVHErZDnb0Pv0VQvnz0L', 'Content-Type': 'application/json'},
    body: '{"inputs":{"name":"dify"},"query":"我选择物化生","response_mode":"streaming","conversation_id":"","user":"abc-123","files":[{"type":"image","transfer_method":"remote_url","url":"https://cloud.dify.ai/logo/logo-site.png"}]}'
  };
  
  fetch('https://api.dify.ai/v1/chat-messages', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));