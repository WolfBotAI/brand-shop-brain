
-- Add AI agent and accounting config columns to stores
ALTER TABLE public.stores 
  ADD COLUMN IF NOT EXISTS ai_chat_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS ai_voice_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS ai_voice_number text,
  ADD COLUMN IF NOT EXISTS accounting_config jsonb DEFAULT '{}';

-- Add accounting_config to profiles for distributor-level accounting
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS accounting_config jsonb DEFAULT '{}';

-- Add UPDATE policy on orders for store owners
CREATE POLICY "Store owners can update orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.store_id AND stores.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.store_id AND stores.user_id = auth.uid()));

-- Seed default platform_fees row if none exists
INSERT INTO public.platform_fees (owner_markup_percent, decoration_fee_default, platform_surcharge_percent, default_shipping_fee, decoration_methods)
SELECT 15, 5.00, 3, 8.99, '[{"name":"Screen Print","fee":5.00},{"name":"Embroidery","fee":8.00},{"name":"DTG","fee":6.50},{"name":"Heat Transfer","fee":4.50}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.platform_fees LIMIT 1);
