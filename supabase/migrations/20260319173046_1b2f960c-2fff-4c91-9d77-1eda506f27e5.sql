
-- Add distributor profile fields
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS company_logo_url text;

-- Create distributor catalogs table
CREATE TABLE public.distributor_catalogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  catalog_name text NOT NULL DEFAULT 'My Catalog',
  selected_products jsonb NOT NULL DEFAULT '[]'::jsonb,
  pricing_rules jsonb NOT NULL DEFAULT '{}'::jsonb,
  shipping_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.distributor_catalogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own catalogs" ON public.distributor_catalogs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own catalogs" ON public.distributor_catalogs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own catalogs" ON public.distributor_catalogs FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own catalogs" ON public.distributor_catalogs FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Storage bucket for logos
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can read logos" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
CREATE POLICY "Authenticated can upload logos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'logos');
CREATE POLICY "Users can update own logos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'logos');
CREATE POLICY "Users can delete own logos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'logos');
