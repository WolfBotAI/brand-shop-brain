UPDATE ss_catalog_cache SET style_image_url = NULL WHERE style_image_url IS NOT NULL;

UPDATE ss_catalog_cache 
SET colors = (
  SELECT jsonb_agg(
    jsonb_set(
      jsonb_set(elem, '{imageUrl}', 'null'::jsonb),
      '{backImageUrl}', 'null'::jsonb
    )
  )
  FROM jsonb_array_elements(colors) AS elem
)
WHERE jsonb_array_length(colors) > 0
AND colors::text LIKE '%ssactivewear%';