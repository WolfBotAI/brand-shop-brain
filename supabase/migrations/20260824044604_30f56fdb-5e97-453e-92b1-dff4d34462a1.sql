
-- 1. Orders: remove unconditional anonymous read
DROP POLICY IF EXISTS "Anon can read orders by email" ON public.orders;
REVOKE SELECT ON public.orders FROM anon;

-- 2. Platform fees: authenticated only
DROP POLICY IF EXISTS "Anyone can read platform fees" ON public.platform_fees;
REVOKE SELECT ON public.platform_fees FROM anon;
CREATE POLICY "Authenticated users can read platform fees"
ON public.platform_fees FOR SELECT TO authenticated USING (true);

-- 3. Stores: no direct anon read; expose a limited public view instead
DROP POLICY IF EXISTS "Public can read stores by slug" ON public.stores;
REVOKE SELECT ON public.stores FROM anon;

CREATE OR REPLACE VIEW public.public_storefronts
WITH (security_invoker = off) AS
SELECT
  s.id,
  s.slug,
  s.store_name,
  s.logo_url,
  s.status,
  s.store_type,
  s.theme_config,
  s.ai_chat_enabled,
  s.ai_voice_enabled,
  s.ai_voice_number,
  (COALESCE(s.metadata, '{}'::jsonb)
    - 'clientEmail' - 'clientPhone' - 'clientName' - 'client_email' - 'client_phone'
    - 'accounting_config' - 'tenant_id' - 'ghl' - 'wolfBot' - 'apiKeys' - 'secrets'
    - 'costs' - 'margins') AS metadata
FROM public.stores s
WHERE s.slug IS NOT NULL;

GRANT SELECT ON public.public_storefronts TO anon, authenticated;

-- 4. Trigger helper should not be callable through the API
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
