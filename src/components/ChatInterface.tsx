import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Zap, Shield, Sword } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome to the Terraria Helper! I\'m here to answer all your questions about items, NPCs, bosses, crafting, and gameplay mechanics. What would you like to know?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      content: 'Thinking...',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      // Simulate API call to backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      // Add bot response
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateTerrariaResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
    } finally {
      setIsLoading(false);
    }
  };

  const generateTerrariaResponse = (query: string): string => {
    // This is a placeholder - in production, this would call your FastAPI backend
    const lowercaseQuery = query.toLowerCase();
    
    if (lowercaseQuery.includes('boss')) {
      return 'Terraria has many challenging bosses! Some key ones include: Eye of Cthulhu (usually first boss), Skeletron (guards the Dungeon), Wall of Flesh (hardmode trigger), and mechanical bosses like The Destroyer, Skeletron Prime, and The Twins. Each boss has unique strategies and drops valuable loot!';
    }
    
    if (lowercaseQuery.includes('weapon') || lowercaseQuery.includes('sword')) {
      return 'Terraria offers hundreds of weapons across different classes! Melee weapons like the Terra Blade, ranged weapons like the Megashark, magic weapons like the Razorblade Typhoon, and summoner weapons like the Stardust Dragon Staff. What class are you interested in?';
    }
    
    if (lowercaseQuery.includes('npc')) {
      return 'NPCs are crucial for progression! The Guide helps with crafting recipes, the Merchant sells basic items, the Nurse heals you, and the Goblin Tinkerer reforges items. Each NPC has specific housing requirements and preferences for biomes and neighbors.';
    }
    
    if (lowercaseQuery.includes('craft') || lowercaseQuery.includes('recipe')) {
      return 'Crafting is at the heart of Terraria! You\'ll need various crafting stations like Workbench, Furnace, Anvil, and more specialized ones. The Guide NPC can show you recipes for any item you have materials for. What are you trying to craft?';
    }
    
    return 'That\'s a great question about Terraria! While I\'m still learning about this specific topic, I can help you with information about bosses, weapons, NPCs, crafting, building, and general gameplay mechanics. Could you be more specific about what you\'d like to know?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Sword className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Terraria Helper</h1>
              <p className="text-slate-300 text-sm">Your guide to the world of Terraria</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-3 py-1 bg-green-600/20 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-4 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white ml-auto'
                  : 'bg-slate-700 text-slate-100 mr-auto'
              } ${
                message.isTyping ? 'animate-pulse' : ''
              } shadow-lg hover:shadow-xl transition-all duration-200`}
            >
              {message.sender === 'bot' && !message.isTyping && (
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-sm font-medium">Terraria Helper</span>
                </div>
              )}
              <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                {message.sender === 'bot' && !message.isTyping && (
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-yellow-400">AI</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-t border-slate-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Terraria..."
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all duration-200"
                rows={1}
                disabled={isLoading}
              />
              <div className="absolute right-3 top-3 text-slate-400">
                <MessageCircle className="w-5 h-5" />
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-2xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:block">Send</span>
            </button>
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <span>Press Enter to send</span>
              <span>•</span>
              <span>Shift + Enter for new line</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Powered by Claude AI</span>
              <Zap className="w-3 h-3 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;