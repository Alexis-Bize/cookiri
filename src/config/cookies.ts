/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

// prettier-ignore
const trackingPatterns = [
  // Google Analytics / Ads (cross-site tracking)
  /^_ga/, /^_gid/, /^_gat/, /^_gcl_au/, /^_gcl_aw/, /^_gac/, /^_dc_gtm_/, 
  /^NID$/, /^1P_JAR$/, /^ANID$/, /^IDE$/, /^test_cookie$/,
  /^FPAU/, /^FPID/, // Google Analytics 4 & Universal Analytics
  /^__gads$/, /^__gpi$/, // DoubleClick (Google advertising)
  // Facebook Pixel (cross-site tracking)  
  /^_fbp$/, /^_fbc$/,
  // LinkedIn Insight Tag (cross-site tracking)
  /^li_/, /^lms_/,
  // Microsoft / Bing Ads (cross-site tracking)
  /^_uetsid$/, /^_uetvid$/, /^MUID$/,
  // TikTok Pixel (cross-site tracking)
  /^_ttp$/,
  // Pinterest Conversion Tag (cross-site tracking)
  /^_pin_unauth$/,
  // Reddit Pixel (cross-site tracking)
  /^rdt_cid$/,
  // Snapchat Pixel (cross-site tracking)
  /^_scid$/,
  // Twitter/X Ads (non-essential only)
  /^personalization_id$/, // Ad personalization
  // Adobe Analytics/Experience Cloud (tracking)
  /^s_cc$/, /^s_sq$/, /^s_vi$/, /^s_fid$/, /^AMCV_/, /^AMCVS_/,
  // Hotjar (behavioral analytics)
  /^_hjid$/, /^_hjFirstSeen$/, /^_hjUserAttributesHash$/, /^_hjCachedUserAttributes$/,
  // PostHog (analytics tracking)
  /^ph_/, /^posthog/,
  // Mixpanel (analytics tracking)
  /^mp_/, /^__mps$/, /^__mpq$/,
  // Amplitude (analytics tracking)
  /^amplitude_/, /^AMP_/,
  // Criteo (retargeting/advertising)
  /^cto_/, /^criteo/,
  // Yandex Analytics (tracking)
  /^_ym_uid/, /^_ym_d/, /^_ym_isad/, /^_ym_visorc/,
  // Baidu Analytics (tracking)
  /^BAIDUID/, /^HMACCOUNT/,
  // Third-party analytics that track across sites
  /^hubspotutk$/, /^__hstc$/,  // HubSpot cross-domain tracking
  /^_mkto_trk$/, // Marketo cross-domain tracking
  /^__qca$/, // Quantcast cross-site tracking
  /^nielsenId$/, // Nielsen cross-site measurement
  // URL tracking parameters (cross-site attribution)
  /^utm_/, /^gclid$/, /^fbclid$/, /^msclkid$/, /^dclid$/, /^ttclid$/,
  /^wbraid$/, /^gbraid$/, // Google Ads enhanced conversions
  /^li_fat_id$/, // LinkedIn attribution
  /^twclid$/, // Twitter conversion tracking
  /^yclid$/, // Yandex attribution
  // General cross-site tracking patterns
  /^_?trk[_-]/, /^_?track[_-]/, /^_?pixel[_-]/,
  // DataFast (datafa.st)
  /^datafast_(session|visitor)_id$/
];

// prettier-ignore
const cloudflarePatterns = [
  // Bot Management & Security
  /^__cf_bm$/, // Bot management cookie (distinguishes humans from bots)
  /^cf_clearance$/, // Security challenge clearance cookie
  /^__cfruid$/, // Rate limiting identifier
  // Load Balancing & Routing
  /^__cflb$/, // Load balancer cookie
  /^cf_ob_info$/, // Origin balancing information
  /^cf_use_ob$/, // Origin balancing usage flag
  // Waiting Room
  /^__cfwaitingroom$/, // Waiting room position/status
  /^cf_queueit_/, // Queue-it integration (waiting room)
  // Access & Zero Trust
  /^CF_Authorization$/, // Cloudflare Access JWT token
  /^cf_access_/, // Access-related cookies
  /^__cf_access_/, // Access session cookies
  // Analytics & Insights
  /^__cfanalytics$/, // Cloudflare Analytics
  /^cf_ray$/, // Ray ID for request tracing
  // Workers & Applications
  /^__cfworker/, // Cloudflare Workers cookies
  /^cf_/, // Generic Cloudflare prefix (catch remaining)
  // Stream & Media
  /^cf_stream_/, // Cloudflare Stream cookies
  // Geographic & Data Center
  /^cf_colo$/, // Colo (data center) identifier
  /^__cf_country$/, // Country detection cookie
  // Legacy/Deprecated (might still be found)
  /^__cfduid$/ // Legacy unique identifier (deprecated but might exist)
];

const config = {
  patterns: {
    tracking: trackingPatterns,
    cloudflare: cloudflarePatterns,
  },
} as const;

export default config;
