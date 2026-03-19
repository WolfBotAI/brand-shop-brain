
CREATE TABLE public.stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id text,
  store_name text NOT NULL,
  client_name text NOT NULL DEFAULT '',
  brand_vertical text NOT NULL DEFAULT 'other',
  external_store_id text,
  catalog_id text,
  domain text,
  status text NOT NULL DEFAULT 'draft',
  logo_url text,
  theme_config jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own stores" ON public.stores
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stores" ON public.stores
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stores" ON public.stores
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own stores" ON public.stores
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
