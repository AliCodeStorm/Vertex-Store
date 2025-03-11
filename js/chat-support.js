class ChatSupport {
  constructor() {
    this.messages = [];
    this.isOpen = false;
    this.initializeChat();
  }
  
  initializeChat() {
    // Create chat UI
    const chatHTML = `
      <div class="chat-container">
        <button class="chat-toggle">Chat Support</button>
        <div class="chat-box">
          <div class="chat-header">
            <h3>Customer Support</h3>
            <button class="close-chat">×</button>
          </div>
          <div class="chat-messages"></div>
          <div class="chat-input">
            <input type="text" placeholder="Type your message...">
            <button class="send-message">Send</button>
          </div>
        </div>
      </div>
    `;
    
    // Add to DOM
    const chatContainer = document.createElement('div');
    chatContainer.innerHTML = chatHTML;
    document.body.appendChild(chatContainer);
    
    // Setup event listeners
    this.setupChatListeners();
    
    // Auto response after 1 second
    setTimeout(() => {
      this.addMessage('Hello! How can I help you today?', 'support');
    }, 1000);
  }
  
  setupChatListeners() {
    // Toggle chat open/closed
    document.querySelector('.chat-toggle').addEventListener('click', () => {
      this.toggleChat();
    });
    
    // Close chat
    document.querySelector('.close-chat').addEventListener('click', () => {
      this.toggleChat(false);
    });
    
    // Send message
    document.querySelector('.send-message').addEventListener('click', () => {
      this.sendMessage();
    });
    
    // Send on Enter key
    document.querySelector('.chat-input input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
  }
  
  toggleChat(open = null) {
    const chatBox = document.querySelector('.chat-box');
    this.isOpen = open !== null ? open : !this.isOpen;
    
    if (this.isOpen) {
      chatBox.classList.add('open');
    } else {
      chatBox.classList.remove('open');
    }
  }
  
  sendMessage() {
    const input = document.querySelector('.chat-input input');
    const message = input.value.trim();
    
    if (message) {
      this.addMessage(message, 'user');
      input.value = '';
      
      // Simulate response after 1-2 seconds
      setTimeout(() => {
        this.simulateResponse(message);
      }, 1000 + Math.random() * 1000);
    }
  }
  
  addMessage(text, sender) {
    const messagesContainer = document.querySelector('.chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = text;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Store message
    this.messages.push({ text, sender, timestamp: new Date() });
  }
  
  simulateResponse(userMessage) {
    // Simple response logic
    let response;
    
    if (userMessage.toLowerCase().includes('stock')) {
      response = "We update our stock in real-time. If an item shows as available, it's ready to ship!";
    } else if (userMessage.toLowerCase().includes('shipping')) {
      response = "We offer free shipping on orders over $50. Standard delivery takes 3-5 business days.";
    } else if (userMessage.toLowerCase().includes('return')) {
      response = "Our return policy allows returns within 30 days of purchase. Please keep the original packaging.";
    } else if (userMessage.toLowerCase().includes('discount') || userMessage.toLowerCase().includes('coupon')) {
      response = "You can use code WELCOME10 for 10% off your first order!";
    } else {
      response = "Thank you for your message. How else can I assist you today?";
    }
    
    this.addMessage(response, 'support');
  }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const chat = new ChatSupport();
}); 