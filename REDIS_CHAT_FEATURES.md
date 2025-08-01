# Redis Chat Features

This document describes the Redis integration features that have been added to the chat functionality.

## Overview

The chat system now uses Redis for:
- **Response caching** - Cache common queries to reduce API calls
- **Session management** - Store chat history per session
- **Analytics** - Track popular queries and usage statistics
- **Activity tracking** - Monitor chat activity for Redis keep-alive

## Features

### 1. Response Caching

**How it works:**
- Each query is hashed and stored in Redis
- Cached responses expire after 1 hour
- Cache hits reduce API calls and improve response time

**Benefits:**
- Faster responses for repeated queries
- Reduced API costs
- Better user experience

**Cache Statistics:**
- Track cache hits and misses
- Calculate cache hit rate
- Monitor cache effectiveness

### 2. Session Management

**Session Storage:**
- Each chat session stores up to 50 messages
- Sessions expire after 7 days
- Messages include query, response, timestamp, and cache status

**Session Endpoints:**
- `GET /session/{session_id}` - Retrieve session history
- Automatic session ID generation if not provided

**Session Data Structure:**
```json
{
  "query": "What is the Eye of Cthulhu?",
  "response": "The Eye of Cthulhu is usually the first boss...",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "cached": false
}
```

### 3. Analytics

**Tracked Metrics:**
- Total chat count
- Daily chat activity
- Popular queries (top 10)
- Cache performance statistics

**Analytics Endpoint:**
- `GET /analytics` - Get comprehensive analytics

**Sample Analytics Response:**
```json
{
  "timestamp": "2024-01-15T12:00:00.000Z",
  "popular_queries": [
    {"query": "eye of cthulhu", "count": 15},
    {"query": "terra blade", "count": 8}
  ],
  "daily_chat_stats": {
    "2024-01-15": 25,
    "2024-01-14": 18
  },
  "cache_stats": {
    "hits": 45,
    "misses": 55,
    "total_requests": 100,
    "hit_rate_percent": 45.0
  },
  "total_chats": 150
}
```

### 4. Enhanced Health Monitoring

**New Metrics in `/redis-health`:**
- Total chats
- Daily chats
- Cache hits/misses
- Cache hit rate
- Last chat activity

**Sample Health Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "redis_status": "connected",
  "metrics": {
    "total_pings": 42,
    "daily_pings": 8,
    "total_chats": 150,
    "daily_chats": 25,
    "cache_hits": 45,
    "cache_misses": 55,
    "cache_hit_rate": 45.0,
    "last_chat_activity": "2024-01-15T12:00:00.000Z"
  }
}
```

## API Endpoints

### Chat Endpoint
```
POST /chat
Content-Type: application/json

{
  "content": "What is the Eye of Cthulhu?",
  "session_id": "optional_session_id"
}
```

### Session History
```
GET /session/{session_id}
```

### Analytics
```
GET /analytics
```

### Enhanced Health Check
```
GET /redis-health
```

## Redis Data Structure

### Keys and Data Types

**Cache Storage:**
- `query:{hash}` - String (cached responses, 1 hour TTL)

**Session Storage:**
- `session:{session_id}` - List (chat history, 7 days TTL)

**Counters:**
- `total_chats` - String (total chat count)
- `cache_hits` - String (cache hit counter)
- `cache_misses` - String (cache miss counter)
- `daily_chats:{date}` - String (daily chat count, 7 days TTL)

**Analytics:**
- `popular_queries` - Sorted Set (query popularity scores)
- `last_chat_activity` - String (last activity timestamp, 1 hour TTL)

**Keep-Alive (existing):**
- `github_actions_ping_count` - String (ping counter)
- `last_ping_timestamp` - String (last ping time)
- `ping_history` - List (ping history)
- `daily_pings:{date}` - String (daily ping count)
- `last_activity` - String (last activity, 1 hour TTL)

## Benefits for Redis Keep-Alive

### Increased Activity
- **Chat interactions** now create Redis activity
- **Session management** requires Redis operations
- **Analytics tracking** maintains Redis connections
- **Caching operations** provide regular Redis usage

### Activity Patterns
- **User-driven activity** - Real chat usage
- **Automated monitoring** - GitHub Actions workflows
- **Analytics processing** - Regular data retrieval
- **Session management** - Ongoing Redis operations

### Monitoring
- **Enhanced health checks** - More comprehensive metrics
- **Chat-specific monitoring** - Track actual usage
- **Performance metrics** - Cache effectiveness
- **Activity timestamps** - Last chat activity tracking

## Usage Examples

### Basic Chat
```bash
curl -X POST https://your-app.vercel.app/chat \
  -H "Content-Type: application/json" \
  -d '{"content": "What is the Eye of Cthulhu?"}'
```

### Chat with Session
```bash
curl -X POST https://your-app.vercel.app/chat \
  -H "Content-Type: application/json" \
  -d '{"content": "How do I summon it?", "session_id": "user123"}'
```

### Get Session History
```bash
curl https://your-app.vercel.app/session/user123
```

### Get Analytics
```bash
curl https://your-app.vercel.app/analytics
```

## Performance Considerations

### Cache Strategy
- **1-hour TTL** for cached responses
- **Hash-based keys** for efficient storage
- **Automatic cleanup** prevents data bloat

### Session Management
- **50-message limit** per session
- **7-day TTL** for session data
- **JSON storage** for structured data

### Analytics
- **Sorted sets** for efficient ranking
- **Daily counters** with automatic expiry
- **Aggregated statistics** for performance

## Monitoring and Maintenance

### Regular Monitoring
- Check cache hit rates
- Monitor session storage usage
- Track popular queries
- Verify Redis connectivity

### Data Cleanup
- Automatic TTL expiration
- Manual cleanup of old data
- Monitor Redis memory usage

### Performance Optimization
- Adjust cache TTL based on usage
- Optimize query patterns
- Monitor response times
- Track API call reduction

## Future Enhancements

### Potential Features
- **User authentication** integration
- **Advanced analytics** dashboard
- **Query clustering** for better caching
- **Personalized responses** based on history
- **Multi-language support** caching
- **Response quality** tracking

### Scalability Considerations
- **Redis clustering** for high traffic
- **Cache warming** strategies
- **Load balancing** for multiple instances
- **Data partitioning** for large datasets 