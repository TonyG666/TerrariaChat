import React from 'react';
import { MessageCircle, Zap, Shield, Sword, Users, BookOpen } from 'lucide-react';

interface WelcomeScreenProps {
  onStartChat: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartChat }) => {
  const features = [
    {
      icon: <Sword className="w-6 h-6" />,
      title: 'Weapons & Items',
      description: 'Get detailed information about any weapon, tool, or item in Terraria',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Boss Strategies',
      description: 'Learn effective strategies for defeating all bosses',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'NPCs & Housing',
      description: 'Understand NPC requirements and housing mechanics',
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Crafting Recipes',
      description: 'Discover crafting recipes and progression paths',
    },
  ];

  const quickQuestions = [
    "How do I defeat the Eye of Cthulhu?",
    "What's the best weapon for a mage build?",
    "How do I get the Goblin Tinkerer?",
    "What are the housing requirements for NPCs?",
    "How do I enter hardmode?",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="flex items-center justify-center max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Sword className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Terraria Helper</h1>
              <p className="text-slate-300">Your AI-powered guide to Terraria</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Welcome to Your Terraria Companion
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Get instant answers to your Terraria questions with our AI-powered chatbot. 
              From crafting recipes to boss strategies, we've got you covered!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-200"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Popular Questions
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={onStartChat}
                  className="px-4 py-2 bg-slate-700 hover:bg-blue-600 border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white rounded-full transition-all duration-200 text-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onStartChat}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center space-x-3 mx-auto"
          >
            <MessageCircle className="w-6 h-6" />
            <span>Start Chatting</span>
            <Zap className="w-5 h-5 text-yellow-400" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-t border-slate-700 p-4">
        <div className="max-w-4xl mx-auto text-center text-slate-400 text-sm">
          <p>Powered by Claude AI • Built with React & TypeScript</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;