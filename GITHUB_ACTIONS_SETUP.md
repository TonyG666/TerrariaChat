# GitHub Actions Daily Ping Setup

This guide explains how to set up a free GitHub Actions workflow that pings your web app and interacts with Redis daily.

## What This Does

- Runs every day at 12:00 UTC (configurable)
- Curls your web app's `/ping` endpoint
- The `/ping` endpoint connects to Redis and:
  - Increments a ping counter
  - Stores the last ping timestamp
  - Maintains a history of the last 10 pings
- Provides success/failure notifications
- Can be triggered manually via GitHub UI

## Setup Instructions

### 1. Deploy Your Backend

Make sure your FastAPI backend is deployed and accessible. The backend now includes:
- A `/ping` endpoint that interacts with Redis
- Redis connection handling
- Error handling for when Redis is unavailable

### 2. Set Up Redis

You have several free Redis options:

#### Option A: Redis Cloud (Free Tier)
1. Go to [Redis Cloud](https://redis.com/try-free/)
2. Create a free account
3. Create a new database
4. Copy the connection URL
5. Set it as an environment variable in your deployment platform

#### Option B: Upstash Redis (Free Tier)
1. Go to [Upstash](https://upstash.com/)
2. Create a free account
3. Create a new Redis database
4. Copy the connection URL
5. Set it as an environment variable

#### Option C: Railway Redis (Free Tier)
1. Go to [Railway](https://railway.app/)
2. Create a free account
3. Create a new Redis service
4. Copy the connection URL
5. Set it as an environment variable

### 3. Configure Environment Variables

In your deployment platform (Vercel, Railway, etc.), set:
```
REDIS_URL=your_redis_connection_string
```

### 4. Update the GitHub Actions Workflow

Edit `.github/workflows/daily-ping.yml` and replace:
```bash
WEBAPP_URL="${WEBAPP_URL:-https://your-app-name.vercel.app}"
```

With your actual deployed URL:
```bash
WEBAPP_URL="${WEBAPP_URL:-https://your-actual-app-url.com}"
```

### 5. Customize the Schedule

The workflow runs daily at 12:00 UTC. To change this, edit the cron expression in `.github/workflows/daily-ping.yml`:

```yaml
schedule:
  - cron: '0 12 * * *'  # Daily at 12:00 UTC
```

Common cron patterns:
- `'0 12 * * *'` - Daily at 12:00 UTC
- `'0 9 * * *'` - Daily at 9:00 UTC  
- `'0 */6 * * *'` - Every 6 hours
- `'0 0 * * *'` - Daily at midnight UTC

### 6. Test the Workflow

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Select "Daily Ping to Web App" workflow
4. Click "Run workflow" to test manually

## What the /ping Endpoint Returns

```json
{
  "status": "success",
  "message": "Successfully pinged Redis",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "ping_count": 42,
  "redis_status": "connected"
}
```

## Monitoring

- Check the "Actions" tab in your GitHub repository to see workflow runs
- Each run shows the HTTP status code and response from your web app
- Failed runs will be clearly marked
- You can view logs for each step

## Troubleshooting

### Redis Connection Issues
- Verify your `REDIS_URL` environment variable is set correctly
- Check that your Redis service is running
- Ensure your deployment platform can reach your Redis instance

### Web App Not Responding
- Verify your web app is deployed and accessible
- Check that the `/ping` endpoint is working by visiting it manually
- Ensure your deployment platform is not sleeping (consider using a service like UptimeRobot for additional monitoring)

### GitHub Actions Not Running
- Check that the workflow file is in the correct location: `.github/workflows/daily-ping.yml`
- Verify the cron syntax is correct
- GitHub Actions may have delays of up to 15 minutes for scheduled runs

## Cost

This setup is completely free:
- GitHub Actions: 2,000 minutes/month free for public repositories
- Redis: Free tiers available from multiple providers
- Web app hosting: Free tiers available from Vercel, Railway, etc.

## Next Steps

You can extend this workflow to:
- Send notifications to Slack/Discord on failures
- Log metrics to external services
- Trigger other automated tasks
- Add more sophisticated health checks 