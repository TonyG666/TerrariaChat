# FastAPI Backend for Terraria Chatbot
# This file should be deployed separately on Render/Railway
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import json
import redis
from datetime import datetime
import hashlib

# Initialize FastAPI app
app = FastAPI(title="Terraria Chatbot API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis connection for caching
redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    password=os.getenv("REDIS_PASSWORD"),
    decode_responses=True
)

# Pydantic models
class ChatMessage(BaseModel):
    content: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    timestamp: datetime

class TerrariaQuery(BaseModel):
    query: str
    context: Optional[List[str]] = None

# Mock Terraria knowledge base (replace with Supabase vector store)
TERRARIA_KNOWLEDGE = {
    "bosses": {
        "Eye of Cthulhu": {
            "description": "The Eye of Cthulhu is usually the first boss players encounter.",
            "strategy": "Use a bow with Frostburn Arrows, build a long platform, and keep moving.",
            "drops": ["Demonite Ore", "Corrupt Seeds", "Unholy Arrow"]
        },
        "Skeletron": {
            "description": "Guards the Dungeon and must be defeated at night.",
            "strategy": "Focus on the hands first, then the head. Use ranged weapons.",
            "drops": ["Skeletron Hand", "Skeletron Mask", "Book of Skulls"]
        }
    },
    "items": {
        "Terra Blade": {
            "description": "One of the most powerful melee weapons in the game.",
            "recipe": "True Excalibur + True Night's Edge at Mythril/Orichalcum Anvil",
            "damage": "115 melee damage"
        }
    },
    "npcs": {
        "Guide": {
            "description": "Provides crafting recipes and basic game information.",
            "housing": "Any valid house will work.",
            "requirements": "Always present at game start"
        }
    }
}

def get_cache_key(query: str, session_id: str) -> str:
    """Generate a cache key for the query."""
    return f"terraria_chat:{session_id}:{hashlib.md5(query.encode()).hexdigest()}"

async def query_claude_api(prompt: str) -> str:
    """
    Query Claude API - replace with actual implementation
    You can use the Anthropic API or Poe.com API here
    """
    # This is a mock implementation
    # Replace with actual Claude API call
    return f"This is a mock response for: {prompt}"

def search_knowledge_base(query: str) -> List[str]:
    """
    Search the Terraria knowledge base for relevant information.
    In production, this would use Supabase vector search.
    """
    results = []
    query_lower = query.lower()
    
    for category, items in TERRARIA_KNOWLEDGE.items():
        for item_name, item_data in items.items():
            if any(keyword in item_name.lower() or keyword in str(item_data).lower() 
                   for keyword in query_lower.split()):
                results.append(f"{item_name}: {item_data.get('description', '')}")
    
    return results[:3]  # Return top 3 results

@app.get("/")
async def root():
    return {"message": "Terraria Chatbot API is running!"}

@app.post("/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    """
    Main chat endpoint that processes user queries about Terraria.
    """
    try:
        session_id = message.session_id or f"session_{datetime.now().timestamp()}"
        cache_key = get_cache_key(message.content, session_id)
        
        # Check cache first
        cached_response = redis_client.get(cache_key)
        if cached_response:
            return ChatResponse(
                response=cached_response,
                session_id=session_id,
                timestamp=datetime.now()
            )
        
        # Search knowledge base for relevant context
        context = search_knowledge_base(message.content)
        
        # Create enhanced prompt with context
        prompt = f"""
        You are a helpful Terraria expert assistant. Answer the user's question about Terraria using the provided context.
        
        Context from Terraria knowledge base:
        {chr(10).join(context) if context else "No specific context found"}
        
        User question: {message.content}
        
        Provide a helpful, accurate response about Terraria. Be specific and include practical advice when possible.
        """
        
        # Query Claude API (replace with actual implementation)
        response = await query_claude_api(prompt)
        
        # Cache the response for 1 hour
        redis_client.setex(cache_key, 3600, response)
        
        return ChatResponse(
            response=response,
            session_id=session_id,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now()}

@app.post("/search")
async def search_terraria(query: TerrariaQuery):
    """
    Search endpoint for Terraria-specific information.
    """
    try:
        results = search_knowledge_base(query.query)
        return {"results": results, "query": query.query}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)