import { useState, useCallback } from 'react';
import { apiService } from '../services/api';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your Terraria Helper. I can answer questions about items, NPCs, bosses, crafting, and gameplay mechanics. What would you like to know?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    console.log('🎯 useChat: Sending message:', content);

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
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
      const response = await apiService.sendMessage(content);
      console.log('🎉 useChat: Received response:', response);
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      // Add bot response
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        sender: 'bot',
        timestamp: new Date(), // Use client's local time instead of server time
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('💀 useChat: Error sending message:', error);
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }. 
        
Debug info: Check browser console for details.
Please try again later.`,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: '1',
        content: 'Hello! I\'m your Terraria Helper. I can answer questions about items, NPCs, bosses, crafting, and gameplay mechanics. What would you like to know?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
    apiService.clearSession();
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};