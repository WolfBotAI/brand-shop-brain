CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule('demo-reminders-every-15-min')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'demo-reminders-every-15-min');

SELECT cron.schedule(
  'demo-reminders-every-15-min',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://zqjfpolkmfzzgszmlifq.supabase.co/functions/v1/demo-reminders',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxamZwb2xrbWZ6emdzem1saWZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MzAyNjAsImV4cCI6MjA4ODIwNjI2MH0.6YE4m0b9LuPh38UVrm_yoybyRBhg_M0ot5ixpE99M6Q"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);