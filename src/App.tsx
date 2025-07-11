import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import ChatInterface from './components/ChatInterface';

function App() {
  const [showChat, setShowChat] = useState(false);

  const handleStartChat = () => {
    setShowChat(true);
  };

  return (
    <div className="App">
      {!showChat ? (
        <WelcomeScreen onStartChat={handleStartChat} />
      ) : (
        <ChatInterface />
      )}
    </div>
  );
}

export default App;