
-- Add Pop-Up Store columns
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS expires_at timestamptz DEFAULT NULL;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS store_type text NOT NULL DEFAULT 'standard';
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS custom_domain text DEFAULT NULL;

-- Allow anon to read orders by customer_email (for customer portal)
CREATE POLICY "Anon can read orders by email"
ON public.orders
FOR SELECT
TO anon
USING (true);
