CREATE TABLE IF NOT EXISTS public.demo_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  role TEXT,
  notes TEXT,
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  slot_start TIMESTAMPTZ NOT NULL,
  slot_end TIMESTAMPTZ,
  ghl_contact_id TEXT,
  ghl_appointment_id TEXT,
  ghl_opportunity_id TEXT,
  status TEXT NOT NULL DEFAULT 'booked',
  confirmation_sent_at TIMESTAMPTZ,
  reminder_48h_sent_at TIMESTAMPTZ,
  reminder_24h_sent_at TIMESTAMPTZ,
  reminder_1h_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.demo_bookings TO service_role;

ALTER TABLE public.demo_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages demo bookings" ON public.demo_bookings;
CREATE POLICY "Service role manages demo bookings"
ON public.demo_bookings FOR ALL
TO service_role
USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS demo_bookings_slot_start_idx ON public.demo_bookings (slot_start);

CREATE OR REPLACE FUNCTION public.set_demo_bookings_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_demo_bookings_updated_at ON public.demo_bookings;
CREATE TRIGGER update_demo_bookings_updated_at
BEFORE UPDATE ON public.demo_bookings
FOR EACH ROW EXECUTE FUNCTION public.set_demo_bookings_updated_at();