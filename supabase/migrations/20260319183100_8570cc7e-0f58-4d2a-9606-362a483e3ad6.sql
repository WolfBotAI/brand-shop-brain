
CREATE TABLE public.platform_fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_markup_percent numeric NOT NULL DEFAULT 0,
  decoration_fee_default numeric NOT NULL DEFAULT 0,
  platform_surcharge_percent numeric NOT NULL DEFAULT 0,
  default_shipping_fee numeric NOT NULL DEFAULT 0,
  decoration_methods jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read platform fees"
ON public.platform_fees FOR SELECT TO anon, authenticated
USING (true);

INSERT INTO public.platform_fees (owner_markup_percent, decoration_fee_default, platform_surcharge_percent, default_shipping_fee, decoration_methods)
VALUES (15, 5.00, 3, 7.50, '[{"method": "Screen Print", "fee": 5.00}, {"method": "Embroidery", "fee": 8.00}, {"method": "DTG", "fee": 12.00}, {"method": "Heat Transfer", "fee": 6.00}]'::jsonb);
