"""
Supabase client for vector storage and database operations.
This handles the knowledge base and conversation history.
"""
import os
from supabase import create_client, Client
from typing import List, Dict, Any, Optional
import json
from datetime import datetime

class SupabaseManager:
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        self.client: Client = create_client(self.supabase_url, self.supabase_key)
    
    async def store_conversation(self, session_id: str, user_message: str, bot_response: str) -> bool:
        """Store conversation in Supabase."""
        try:
            data = {
                "session_id": session_id,
                "user_message": user_message,
                "bot_response": bot_response,
                "timestamp": datetime.now().isoformat()
            }
            
            result = self.client.table("conversations").insert(data).execute()
            return True
        except Exception as e:
            print(f"Error storing conversation: {e}")
            return False
    
    async def search_knowledge_base(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search the vector-based knowledge base."""
        try:
            # This would use Supabase's vector search capabilities
            # For now, implementing a simple text search
            result = self.client.table("terraria_knowledge")\
                .select("*")\
                .text_search("content", query)\
                .limit(limit)\
                .execute()
            
            return result.data
        except Exception as e:
            print(f"Error searching knowledge base: {e}")
            return []
    
    async def get_conversation_history(self, session_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get conversation history for a session."""
        try:
            result = self.client.table("conversations")\
                .select("*")\
                .eq("session_id", session_id)\
                .order("timestamp", desc=True)\
                .limit(limit)\
                .execute()
            
            return result.data
        except Exception as e:
            print(f"Error getting conversation history: {e}")
            return []
    
    async def store_terraria_knowledge(self, item_name: str, category: str, content: str, metadata: Dict[str, Any]) -> bool:
        """Store Terraria knowledge in the database."""
        try:
            data = {
                "item_name": item_name,
                "category": category,
                "content": content,
                "metadata": json.dumps(metadata),
                "created_at": datetime.now().isoformat()
            }
            
            result = self.client.table("terraria_knowledge").insert(data).execute()
            return True
        except Exception as e:
            print(f"Error storing knowledge: {e}")
            return False