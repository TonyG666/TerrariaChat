# Deployment Guide for Terraria Chatbot Backend

## Environment Setup

### Required Environment Variables
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
REDIS_HOST=your_redis_host
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
ANTHROPIC_API_KEY=your_claude_api_key
```

## Database Schema (Supabase)

### 1. Conversations Table
```sql
CREATE TABLE conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Create index for better performance
CREATE INDEX idx_conversations_session_id ON conversations(session_id);
CREATE INDEX idx_conversations_timestamp ON conversations(timestamp);
```

### 2. Terraria Knowledge Table
```sql
CREATE TABLE terraria_knowledge (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Enable full text search
    content_search_vector TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', content)) STORED
);

-- Enable RLS
ALTER TABLE terraria_knowledge ENABLE ROW LEVEL SECURITY;

-- Create indexes for search performance
CREATE INDEX idx_terraria_knowledge_category ON terraria_knowledge(category);
CREATE INDEX idx_terraria_knowledge_search ON terraria_knowledge USING gin(content_search_vector);
CREATE INDEX idx_terraria_knowledge_name ON terraria_knowledge(item_name);
```

## Deployment Options

### Option 1: Render (Recommended)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use the Dockerfile for deployment
4. Add environment variables in Render dashboard

### Option 2: Railway
1. Connect GitHub repository to Railway
2. Deploy with automatic Docker detection
3. Configure environment variables
4. Connect Redis and Supabase

### Option 3: Google Cloud Run
1. Build Docker image: `docker build -t terraria-chatbot .`
2. Push to Google Container Registry
3. Deploy to Cloud Run
4. Configure environment variables

## Redis Setup
- Use Redis Labs (free tier) or Upstash
- Configure connection string in environment variables

## Claude API Integration
- Sign up for Anthropic API or use Poe.com API
- Add API key to environment variables
- Update the `query_claude_api` function in main.py

## Testing
```bash
# Install dependencies
pip install -r requirements.txt

# Run locally
uvicorn main:app --reload

# Test endpoints
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{"content": "How do I defeat the Eye of Cthulhu?"}'
```