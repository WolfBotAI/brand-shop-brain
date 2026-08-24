
-- Public-safe copy of store metadata, maintained automatically
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS public_metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE OR REPLACE FUNCTION public.sync_store_public_metadata()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.public_metadata := COALESCE(NEW.metadata, '{}'::jsonb)
    - 'clientEmail' - 'clientPhone' - 'clientName' - 'client_email' - 'client_phone'
    - 'accounting_config' - 'tenant_id' - 'ghl' - 'wolfBot' - 'apiKeys' - 'secrets'
    - 'costs' - 'margins';
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.sync_store_public_metadata() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS stores_sync_public_metadata ON public.stores;
CREATE TRIGGER stores_sync_public_metadata
BEFORE INSERT OR UPDATE ON public.stores
FOR EACH ROW EXECUTE FUNCTION public.sync_store_public_metadata();

UPDATE public.stores SET metadata = metadata;

-- Replace the definer view with an invoker view backed by RLS + column grants
DROP VIEW IF EXISTS public.public_storefronts;
CREATE VIEW public.public_storefronts
WITH (security_invoker = on) AS
SELECT
  s.id, s.slug, s.store_name, s.logo_url, s.status, s.store_type,
  s.theme_config, s.ai_chat_enabled, s.ai_voice_enabled, s.ai_voice_number,
  s.public_metadata AS metadata
FROM public.stores s
WHERE s.slug IS NOT NULL;

CREATE POLICY "Public can read published storefront fields"
ON public.stores FOR SELECT TO anon USING (slug IS NOT NULL);

REVOKE SELECT ON public.stores FROM anon;
GRANT SELECT (id, slug, store_name, logo_url, status, store_type, theme_config,
              ai_chat_enabled, ai_voice_enabled, ai_voice_number, public_metadata)
ON public.stores TO anon;
GRANT SELECT ON public.public_storefronts TO anon, authenticated;
