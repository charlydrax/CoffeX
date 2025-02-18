const { io } = require("socket.io-client");
const socket_js = io();

function setupSocket() {
    
  const form = document.getElementsByClassName('page_formCoffs__vSVSN')[0];
  // const input = document.getElementById('input');
  const input = document.getElementById('sendCoff');
  const textOfCoff = document.getElementById('textOfCoff');
  const messages = document.getElementById('messages');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
      socket_js.emit('chat message', input.value);
      input.value = '';
    }
  });
  
  socket_js.on('chat message', (msg) => {
    const item = document.createElement('li');
    
    item.textContent = textOfCoff.value;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
    
  });
}

module.exports = { setupSocket };