

# Set Up Automated Catalog Enrichment via Cron Job

## Current State
- **5,674 styles remaining** with `total_skus = 0` (unenriched)
- ~54 styles already enriched with colors, sizes, and pricing
- The `sync-catalog?mode=detail&limit=10` call works reliably, enriching 10 styles per invocation (~15 seconds per call)
- Running parallel calls causes race conditions (same rows grabbed twice)

## Problem
Manually calling the edge function 570+ times is not viable. We need automated, sequential execution.

## Plan

### 1. Set up pg_cron + pg_net to auto-call sync-catalog every minute
- Enable `pg_cron` and `pg_net` extensions
- Create a cron job that calls `sync-catalog?mode=detail&limit=10` every minute
- At 10 styles/minute, all 5,674 will be enriched in ~9.5 hours
- Once enrichment is complete (`remaining = 0`), the function returns `enriched: 0` harmlessly

### 2. After initial enrichment completes, update cron to nightly
- Change schedule from `* * * * *` (every minute) to `0 2 * * *` (2 AM daily) for ongoing updates

### Implementation
- Use the Supabase SQL insert tool (not migration) to create the cron job since it contains project-specific URLs and keys
- The cron job will call: `https://zqjfpolkmfzzgszmlifq.supabase.co/functions/v1/sync-catalog?mode=detail&limit=10`

### Files
No code changes needed — just SQL to enable extensions and create the cron schedule.

