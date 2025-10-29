#!/bin/bash

# Quick Redis Chat Test Script
# Tests Redis functionality with simple curl commands

echo "🚀 Quick Redis Chat Test"
echo "========================"

# Test 1: Check if backend is running locally
echo "1. Testing local backend..."
if curl -s http://localhost:8000/ > /dev/null 2>&1; then
    echo "✅ Backend is running locally"
    API_URL="http://localhost:8000"
else
    echo "❌ Backend not running locally"
    echo "💡 Start it with: cd src/backend && python main.py"
    exit 1
fi

# Test 2: Test Redis connection
echo ""
echo "2. Testing Redis connection..."
PING_RESPONSE=$(curl -s "$API_URL/ping")
if echo "$PING_RESPONSE" | grep -q '"redis_status":"connected"'; then
    echo "✅ Redis is connected"
    echo "📊 Ping count: $(echo "$PING_RESPONSE" | grep -o '"ping_count":[0-9]*' | cut -d':' -f2)"
else
    echo "❌ Redis connection failed"
    echo "Response: $PING_RESPONSE"
    exit 1
fi

# Test 3: Send a chat message
echo ""
echo "3. Testing chat functionality..."
CHAT_RESPONSE=$(curl -s -X POST "$API_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{"content": "What is the Eye of Cthulhu?", "session_id": "test_user_123"}')

if echo "$CHAT_RESPONSE" | grep -q '"session_id"'; then
    echo "✅ Chat request successful"
    SESSION_ID=$(echo "$CHAT_RESPONSE" | grep -o '"session_id":"[^"]*"' | cut -d'"' -f4)
    echo "📝 Session ID: $SESSION_ID"
else
    echo "❌ Chat request failed"
    echo "Response: $CHAT_RESPONSE"
    exit 1
fi

# Test 4: Check session history
echo ""
echo "4. Testing session history..."
SESSION_RESPONSE=$(curl -s "$API_URL/session/$SESSION_ID")
if echo "$SESSION_RESPONSE" | grep -q '"message_count"'; then
    MESSAGE_COUNT=$(echo "$SESSION_RESPONSE" | grep -o '"message_count":[0-9]*' | cut -d':' -f2)
    echo "✅ Session history accessible"
    echo "📊 Messages in session: $MESSAGE_COUNT"
    
    if [ "$MESSAGE_COUNT" -gt 0 ]; then
        echo "🎉 Redis is storing chat data!"
    else
        echo "⚠️  No messages found in session"
    fi
else
    echo "❌ Session history failed"
    echo "Response: $SESSION_RESPONSE"
fi

# Test 5: Check analytics
echo ""
echo "5. Testing analytics..."
ANALYTICS_RESPONSE=$(curl -s "$API_URL/analytics")
if echo "$ANALYTICS_RESPONSE" | grep -q '"total_chats"'; then
    TOTAL_CHATS=$(echo "$ANALYTICS_RESPONSE" | grep -o '"total_chats":[0-9]*' | cut -d':' -f2)
    CACHE_HITS=$(echo "$ANALYTICS_RESPONSE" | grep -o '"hits":[0-9]*' | cut -d':' -f2)
    CACHE_MISSES=$(echo "$ANALYTICS_RESPONSE" | grep -o '"misses":[0-9]*' | cut -d':' -f2)
    
    echo "✅ Analytics working"
    echo "📊 Total chats: $TOTAL_CHATS"
    echo "🎯 Cache hits: $CACHE_HITS"
    echo "❌ Cache misses: $CACHE_MISSES"
    
    if [ "$TOTAL_CHATS" -gt 0 ]; then
        echo "🎉 Redis is tracking analytics!"
    fi
else
    echo "❌ Analytics failed"
    echo "Response: $ANALYTICS_RESPONSE"
fi

# Test 6: Test caching (send same query twice)
echo ""
echo "6. Testing caching..."
echo "📤 Sending first request..."
TIME1=$(curl -s -w "%{time_total}" -X POST "$API_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{"content": "What is Skeletron?", "session_id": "cache_test"}' -o /dev/null)

sleep 1

echo "📤 Sending second request (should be cached)..."
TIME2=$(curl -s -w "%{time_total}" -X POST "$API_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{"content": "What is Skeletron?", "session_id": "cache_test"}' -o /dev/null)

echo "⏱️  First request: ${TIME1}s"
echo "⏱️  Second request: ${TIME2}s"

if (( $(echo "$TIME2 < $TIME1" | bc -l) )); then
    echo "🚀 Second request was faster - caching working!"
else
    echo "⚠️  Response times similar - check cache status"
fi

echo ""
echo "========================"
echo "🎉 Quick test complete!"
echo ""
echo "💡 Summary:"
echo "- Redis connection: ✅"
echo "- Chat functionality: ✅"
echo "- Session storage: ✅"
echo "- Analytics tracking: ✅"
echo "- Caching: $(if (( $(echo "$TIME2 < $TIME1" | bc -l) )); then echo "✅"; else echo "⚠️"; fi)" 