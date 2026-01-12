---
description: Monitor Vercel deployment logs and health
---
# Vercel Monitoring Agent

Use this workflow to check the health of the production deployment and analyze recent logs for errors or performance latencies.

## Steps

1. Run the custom agent script:
   ```bash
   npx tsx scripts/vercel-agent.ts
   ```

2. (Optional) For real-time tailing of logs without analysis:
   ```bash
   vercel logs caminhos-campinas.vercel.app
   ```

3. Review the agent's summary report for:
   - High latency requests (>1s)
   - HTTP 4xx/5xx errors
   - System stability status
