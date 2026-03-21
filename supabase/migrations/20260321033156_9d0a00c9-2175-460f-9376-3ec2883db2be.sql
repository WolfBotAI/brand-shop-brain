
-- Create ss_catalog_cache table for cached S&S product data
CREATE TABLE public.ss_catalog_cache (
  style_id integer PRIMARY KEY,
  title text NOT NULL DEFAULT '',
  brand_name text NOT NULL DEFAULT '',
  base_category text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  style_image_url text,
  colors jsonb NOT NULL DEFAULT '[]'::jsonb,
  sizes jsonb NOT NULL DEFAULT '[]'::jsonb,
  pricing jsonb NOT NULL DEFAULT '{}'::jsonb,
  total_skus integer NOT NULL DEFAULT 0,
  raw_categories text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: public read, service role write
ALTER TABLE public.ss_catalog_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read catalog cache"
  ON public.ss_catalog_cache
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create product-images storage bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Allow public read on product-images bucket
CREATE POLICY "Public read product images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

-- Allow service role insert/update (edge functions use service role)
CREATE POLICY "Service role can upload product images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');
