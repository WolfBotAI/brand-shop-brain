ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS shipping_details jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS fulfillment_details jsonb DEFAULT '{}'::jsonb;