
-- Vision Jobs table for AI document processing
CREATE TABLE public.vision_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  source text NOT NULL DEFAULT 'email',
  subject text NOT NULL,
  customer text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  error_flag text,
  extracted_fields jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.vision_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own vision_jobs" ON public.vision_jobs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vision_jobs" ON public.vision_jobs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vision_jobs" ON public.vision_jobs
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own vision_jobs" ON public.vision_jobs
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Routing Rules table for order routing configuration
CREATE TABLE public.routing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  decoration_type text NOT NULL,
  supplier text NOT NULL,
  decorator text NOT NULL,
  priority integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.routing_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own routing_rules" ON public.routing_rules
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own routing_rules" ON public.routing_rules
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own routing_rules" ON public.routing_rules
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own routing_rules" ON public.routing_rules
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Orders table for public storefront checkout
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  customer_email text NOT NULL,
  customer_name text NOT NULL DEFAULT '',
  shipping_address jsonb DEFAULT '{}',
  items jsonb NOT NULL DEFAULT '[]',
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Store owners can see orders for their stores
CREATE POLICY "Store owners can read orders" ON public.orders
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.stores WHERE stores.id = orders.store_id AND stores.user_id = auth.uid()));

-- Anyone can place an order (public checkout)
CREATE POLICY "Anyone can insert orders" ON public.orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Add slug column to stores for public storefront URLs
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Public read policy for stores by slug (for public storefront)
CREATE POLICY "Public can read stores by slug" ON public.stores
  FOR SELECT TO anon
  USING (slug IS NOT NULL);
