# Terraria Chatbot

A comprehensive AI-powered chatbot for Terraria players, providing instant answers to questions about items, NPCs, bosses, crafting, and gameplay mechanics.

## Features

- 🎮 **Interactive Chat Interface**: Beautiful, responsive chat UI with Terraria-themed design
- 🤖 **AI-Powered Responses**: Powered by Groq's GPT-OSS-120B for intelligent, context-aware answers
- 🔍 **Smart Search**: Advanced search through Terraria knowledge base
- 💾 **Session Management**: Persistent chat sessions with message history
- ⚡ **Fast Performance**: Groq API provides lightning-fast responses
- 📱 **Mobile Responsive**: Works perfectly on all devices

## Tech Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for development and building
- **Lucide React** for icons

### Backend
- **FastAPI** (Python) for API server
- **Groq API** (GPT-OSS-120B) for natural language processing
- **Docker** for containerization

### Deployment
- **Vercel** for frontend hosting
- **Render** for backend deployment

## Quick Start

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
# Navigate to backend directory
cd src/backend

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables (copy .env.example to .env)
cp .env.example .env

# Add your Groq API key to .env
GROQ_API_KEY=your_groq_api_key_here

# Run the FastAPI server
uvicorn main:app --reload
```

### Environment Variables

#### For Development (.env file):
```
GROQ_API_KEY=your_groq_api_key_here
VITE_API_URL=http://localhost:8000
```

#### For Production (Render):
```
GROQ_API_KEY=your_groq_api_key_here
```

## Getting Groq API Key

1. Sign up at [console.groq.com](https://console.groq.com)
2. Go to Dashboard → API Keys
3. Create a new API key
4. Copy the key to your environment variables

**Free Tier:** 6,000 tokens/minute - perfect for development and moderate usage!

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variable: `VITE_API_URL=https://your-backend-url.onrender.com`
3. Deploy automatically on push

### Backend (Render)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set Root Directory to `src/backend`
4. Add environment variable: `GROQ_API_KEY=your_key_here`
5. Deploy with Docker

## API Endpoints

- `GET /` - API status and health check
- `POST /chat` - Send message to chatbot
- `POST /search` - Search Terraria knowledge base
- `GET /health` - Detailed health check

## Features

### Enhanced Knowledge Base
- Detailed boss strategies and mechanics
- Weapon stats and crafting recipes
- NPC requirements and housing info
- Crafting station information
- Progression guides

### Intelligent Responses
- Context-aware answers using Groq's GPT-OSS-120B
- Fallback responses for offline scenarios
- Gaming-focused language and terminology
- Practical tips and strategies

### Modern UI/UX
- Terraria-themed dark design
- Smooth animations and transitions
- Mobile-responsive layout
- Real-time typing indicators
- Message history and session management

## Architecture

```
Frontend (React/TypeScript)
    ↓
API Service Layer
    ↓
FastAPI Backend
    ↓
Groq API (GPT-OSS-120B)
    ↓
Enhanced Knowledge Base
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open a GitHub issue or contact the maintainers.

---

**Powered by Groq's GPT-OSS-120B • Built with React & FastAPI**