# FastAPI Backend for Terraria Chatbot with Groq API
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import json
import httpx
from datetime import datetime, timedelta

# Initialize FastAPI app
app = FastAPI(title="Terraria Chatbot API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatMessage(BaseModel):
    content: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    timestamp: datetime

# Groq API configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# Simple in-memory storage (no external dependencies)

# Enhanced Terraria knowledge base
TERRARIA_KNOWLEDGE = {
    "bosses": {
        "Eye of Cthulhu": {
            "description": "The Eye of Cthulhu is usually the first boss players encounter.",
            "strategy": "Use a bow with Frostburn Arrows, build a long platform, and keep moving. Focus on the pupil when it charges.",
            "drops": ["Demonite Ore", "Corrupt Seeds", "Unholy Arrow"],
            "summon": "Suspicious Looking Eye at night, or spawns naturally with 200+ HP and 10+ defense"
        },
        "Skeletron": {
            "description": "Guards the Dungeon and must be defeated at night.",
            "strategy": "Focus on the hands first, then the head. Use ranged weapons and build a large arena.",
            "drops": ["Skeletron Hand", "Skeletron Mask", "Book of Skulls"],
            "summon": "Talk to Old Man at Dungeon entrance at night"
        },
        "Wall of Flesh": {
            "description": "The final pre-hardmode boss that triggers hardmode when defeated.",
            "strategy": "Build a long bridge in the Underworld, use ranged weapons, focus on eyes and mouth.",
            "drops": ["Pwnhammer", "Hardmode ores", "Emblems"],
            "summon": "Drop Guide Voodoo Doll in lava in the Underworld"
        }
    },
    "items": {
        "Terra Blade": {
            "description": "One of the most powerful melee weapons in the game.",
            "recipe": "True Excalibur + True Night's Edge at Mythril/Orichalcum Anvil",
            "damage": "115 melee damage",
            "type": "Hardmode sword"
        },
        "Megashark": {
            "description": "Powerful ranged weapon that fires rapidly.",
            "recipe": "Minishark + Illegal Gun Parts + Shark Fin + Soul of Might (5)",
            "damage": "25 ranged damage",
            "special": "50% chance not to consume ammo"
        }
    },
    "npcs": {
        "Guide": {
            "description": "Provides crafting recipes and basic game information.",
            "housing": "Any valid house will work.",
            "requirements": "Always present at game start",
            "function": "Shows crafting recipes for items you have materials for"
        },
        "Merchant": {
            "description": "Sells basic items and tools.",
            "housing": "Standard NPC housing requirements.",
            "requirements": "Have 50+ silver coins",
            "items": "Rope, torches, piggy bank, mining potions"
        }
    }
}

def search_knowledge_base(query: str) -> List[str]:
    """Search the Terraria knowledge base for relevant information."""
    results = []
    query_lower = query.lower()
    
    for category, items in TERRARIA_KNOWLEDGE.items():
        for item_name, item_data in items.items():
            if any(keyword in item_name.lower() or keyword in str(item_data).lower() 
                   for keyword in query_lower.split()):
                context = f"{item_name} ({category}): {item_data.get('description', '')}"
                if 'strategy' in item_data:
                    context += f" Strategy: {item_data['strategy']}"
                results.append(context)
    
    return results[:5]  # Return top 5 results

async def query_groq_api(prompt: str, context: List[str]) -> str:
    """Query Groq API for intelligent responses."""
    if not GROQ_API_KEY:
        return generate_fallback_response(prompt)
    
    try:
        # Prepare context
        context_text = "\n".join(context) if context else "No specific context available."
        
        # Create system prompt
        system_prompt = f"""You are a helpful Terraria expert assistant. You have extensive knowledge about Terraria gameplay, items, NPCs, bosses, crafting, and mechanics.

Context from knowledge base:
{context_text}

Instructions:
- Provide accurate, helpful information about Terraria
- Be enthusiastic and engaging like a fellow gamer
- Include specific strategies, tips, and practical advice
- If you don't know something specific, suggest general approaches
- Keep responses concise but informative (2-3 paragraphs max)
- Use gaming terminology that Terraria players understand"""

        async with httpx.AsyncClient() as client:
            print(f"Making POST request to: {GROQ_API_URL}")
            print(f"Request headers: Authorization=Bearer {GROQ_API_KEY[:10]}..., Content-Type=application/json")

            # Use streaming interface to process Server-Sent-Events lines
            async with client.stream(
                "POST",
                GROQ_API_URL,
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "openai/gpt-oss-120b",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 1,
                    "max_completion_tokens": 8192,
                    "top_p": 1,
                    "reasoning_effort": "medium",
                    "stream": True
                },
                timeout=30.0
            ) as response:
                if response.status_code == 200:
                    content = ""
                    async for line in response.aiter_lines():
                        if not line:
                            continue
                        if line.startswith('data: '):
                            data_str = line[6:]  # Remove 'data: ' prefix
                            if data_str.strip() == '[DONE]':
                                break
                            try:
                                data = json.loads(data_str)
                                if 'choices' in data and len(data['choices']) > 0:
                                    delta = data['choices'][0].get('delta', {})
                                    if 'content' in delta:
                                        content += delta['content']
                            except json.JSONDecodeError:
                                continue
                    return content if content else generate_fallback_response(prompt)
                else:
                    print(f"Groq API error: {response.status_code}")
                    print(f"Response headers: {dict(response.headers)}")
                    try:
                        error_detail = await response.aread()
                        # Attempt to parse error as JSON if possible
                        try:
                            print(f"Error details: {json.loads(error_detail)}")
                        except Exception:
                            print(f"Error response text: {error_detail.decode('utf-8', 'ignore')}")
                    except Exception as e:
                        print(f"Error reading error body: {e}")
                    return generate_fallback_response(prompt)
                
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return generate_fallback_response(prompt)

def generate_fallback_response(query: str) -> str:
    """Generate a fallback response when API is unavailable."""
    query_lower = query.lower()
    
    # Boss-related queries
    if any(boss in query_lower for boss in ['boss', 'eye of cthulhu', 'skeletron', 'wall of flesh']):
        if 'eye of cthulhu' in query_lower:
            return "The Eye of Cthulhu is usually the first boss you'll encounter! To summon it, use a Suspicious Looking Eye at night, or it may spawn naturally if you have 200+ HP and 10+ defense. Build a long platform arena and use a bow with Frostburn Arrows. Keep moving and aim for the pupil when it charges at you!"
        elif 'skeletron' in query_lower:
            return "Skeletron guards the Dungeon and must be defeated at night! Focus on destroying both hands first to reduce damage, then attack the head. Use ranged weapons and build a large arena. Don't let the fight go past dawn or Skeletron will kill you instantly!"
        elif 'wall of flesh' in query_lower:
            return "The Wall of Flesh is the final pre-hardmode boss! Build a long bridge across the Underworld (at least 1000 blocks). Use ranged weapons and focus fire on the eyes and mouth. Defeating it triggers hardmode and spawns new ores in your world!"
        else:
            return "Terraria has many challenging bosses! Start with the Eye of Cthulhu, then Skeletron, followed by the Wall of Flesh to enter hardmode. Each boss requires different strategies and rewards you with unique loot!"
    
    # Weapon-related queries
    elif any(weapon in query_lower for weapon in ['weapon', 'sword', 'gun', 'bow', 'terra blade', 'megashark']):
        if 'terra blade' in query_lower:
            return "The Terra Blade is one of the best melee weapons! To craft it, you need True Excalibur + True Night's Edge at a Mythril/Orichalcum Anvil. It shoots projectiles and has 115 base damage. You'll need to progress through hardmode to get the materials!"
        elif 'megashark' in query_lower:
            return "The Megashark is an excellent ranged weapon! Craft it with Minishark + Illegal Gun Parts + Shark Fin + 5 Souls of Might. It has a 50% chance not to consume ammo and fires very rapidly. Great for hardmode bosses!"
        else:
            return "Terraria offers hundreds of weapons across different classes! Melee (swords, spears), Ranged (bows, guns), Magic (staffs, tomes), and Summoner (minions, whips). What class interests you most?"
    
    # NPC-related queries
    elif any(npc in query_lower for npc in ['npc', 'guide', 'merchant', 'nurse', 'housing']):
        if 'guide' in query_lower:
            return "The Guide is your most helpful NPC! He shows crafting recipes for any item you have materials for. Just talk to him with materials in your inventory. He also provides general gameplay tips and can tell you what to do next!"
        elif 'merchant' in query_lower:
            return "The Merchant sells basic items and tools! He appears when you have 50+ silver coins. He sells useful items like rope, torches, piggy banks, and mining potions. His inventory changes based on certain conditions!"
        elif 'housing' in query_lower:
            return "NPC housing requires: 6x10 minimum size, walls, door, table, chair, and light source. Each NPC has biome preferences and likes/dislikes certain neighbors. Happy NPCs sell items cheaper and may sell unique items!"
        else:
            return "NPCs are essential for progression! The Guide helps with crafting, Merchant sells basics, Nurse heals you, and many others provide unique services. Each has specific requirements to move in!"
    
    # Crafting-related queries
    elif any(craft in query_lower for craft in ['craft', 'recipe', 'make', 'create']):
        return "Crafting is core to Terraria! You'll need various crafting stations: Workbench (basic items), Furnace (bars), Anvil (tools/weapons), and many specialized stations. The Guide NPC shows recipes for items you have materials for. What are you trying to craft?"
    
    # General gameplay
    elif any(general in query_lower for general in ['start', 'beginning', 'new', 'tips']):
        return "Welcome to Terraria! Start by chopping trees and mining stone to build basic shelter before night falls. Craft a workbench, then tools and weapons. Talk to the Guide for crafting help. Explore caves for better materials, then prepare to fight the Eye of Cthulhu!"
    
    # Default response
    else:
        return f"That's a great question about Terraria! I can help with information about bosses, weapons, NPCs, crafting, building, and gameplay mechanics. Could you be more specific about what you'd like to know? For example, ask about specific bosses, weapon types, or game progression!"

@app.get("/")
async def root():
    return {"message": "Terraria Chatbot API is running!", "status": "healthy"}

@app.get("/test-groq")
async def test_groq():
    """Test endpoint to verify Groq API connection."""
    if not GROQ_API_KEY:
        return {"error": "GROQ_API_KEY not set", "status": "error"}
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                GROQ_API_URL,
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "openai/gpt-oss-120b",
                    "messages": [{"role": "user", "content": "Hello"}],
                    "max_completion_tokens": 10,
                    "stream": False
                },
                timeout=10.0
            )
            return {
                "status": "success" if response.status_code == 200 else "error",
                "status_code": response.status_code,
                "response": response.text[:200] if response.status_code != 200 else "API working"
            }
    except Exception as e:
        return {"error": str(e), "status": "error"}

@app.post("/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    """Main chat endpoint that processes user queries about Terraria."""
    try:
        session_id = message.session_id or f"session_{datetime.now().timestamp()}"
        timestamp = datetime.now().isoformat()
        
        # Search knowledge base for context
        context = search_knowledge_base(message.content)
        
        # Get AI response
        response = await query_groq_api(message.content, context)
        
        return ChatResponse(
            response=response,
            session_id=session_id,
            timestamp=timestamp
        )
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return ChatResponse(
            response="I'm sorry, I encountered an error processing your request. Please try again.",
            session_id=message.session_id or "error",
            timestamp=datetime.now().isoformat()
        )

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/ping")
async def ping():
    """Simple ping endpoint."""
    return {
        "status": "success",
        "message": "API is running",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/search")
async def search_terraria(query: dict):
    """Search endpoint for Terraria-specific information."""
    try:
        results = search_knowledge_base(query.get("query", ""))
        return {"results": results, "query": query.get("query", "")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)