# Terraria Chatbot

A comprehensive AI-powered chatbot for Terraria players, providing instant answers to questions about items, NPCs, bosses, crafting, and gameplay mechanics.

## Features

- 🎮 **Interactive Chat Interface**: Beautiful, responsive chat UI with Terraria-themed design
- 🤖 **AI-Powered Responses**: Powered by Claude AI for intelligent, context-aware answers
- 🔍 **Vector Search**: Advanced search through Terraria knowledge base
- 💾 **Conversation History**: Persistent chat sessions with message history
- ⚡ **Fast Performance**: Redis caching for quick response times
- 📱 **Mobile Responsive**: Works perfectly on all devices

## Tech Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for development and building
- **Lucide React** for icons

### Backend
- **FastAPI** (Python) for API server
- **Claude AI** for natural language processing
- **Supabase** for database and vector storage
- **Redis** for caching
- **Docker** for containerization

### Deployment
- **Vercel** for frontend hosting
- **Render/Railway** for backend deployment
- **Supabase** for managed database
- **Redis Labs** for managed Redis

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

# Run the FastAPI server
uvicorn main:app --reload
```

### Environment Variables
Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:8000
```

For backend deployment, set these environment variables:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
REDIS_HOST=your_redis_host
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
ANTHROPIC_API_KEY=your_claude_api_key
```

## Database Schema

### Conversations Table
```sql
CREATE TABLE conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

### Terraria Knowledge Table
```sql
CREATE TABLE terraria_knowledge (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy with Docker

### Database (Supabase)
1. Create a new Supabase project
2. Run the SQL schema setup
3. Configure Row Level Security policies

## API Endpoints

- `POST /chat` - Send message to chatbot
- `POST /search` - Search Terraria knowledge base
- `GET /health` - Health check endpoint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open a GitHub issue or contact the maintainers.