import { supabase } from "@/integrations/supabase/client";

type FirecrawlResponse<T = unknown> = {
  success: boolean;
  error?: string;
  data?: T;
};

export type BrandingData = {
  colorScheme?: string;
  logo?: string;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    textPrimary?: string;
    textSecondary?: string;
  };
  fonts?: { family: string }[];
  typography?: {
    fontFamilies?: { primary?: string; heading?: string };
  };
  images?: {
    logo?: string;
    favicon?: string;
    ogImage?: string;
  };
};

export const firecrawlApi = {
  async scrapeBranding(url: string): Promise<FirecrawlResponse<BrandingData>> {
    const { data, error } = await supabase.functions.invoke("firecrawl-scrape", {
      body: { url, options: { formats: ["branding"] } },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Firecrawl v1 nests inside data.data
    const branding = data?.data?.branding || data?.branding;
    if (branding) {
      return { success: true, data: branding };
    }
    return { success: true, data: data?.data || data };
  },
};
