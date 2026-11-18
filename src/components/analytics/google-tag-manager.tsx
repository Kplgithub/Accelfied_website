import Script from 'next/script';

/** Google Tag Manager container for accelfied. Tags (GA4 etc.) are managed inside GTM. */
export const GTM_ID = 'GTM-MKLTNXPL';

/**
 * Standard GTM loader. `afterInteractive` keeps it off the critical render path;
 * Next.js injects it once, so client-side navigations never reload the container.
 * Page changes between routes are picked up by GTM's History Change trigger /
 * GA4 enhanced measurement (Next.js uses history.pushState).
 */
export function GoogleTagManager() {
  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

/** Fallback for visitors with JavaScript disabled; must sit right after <body>. */
export function GoogleTagManagerNoScript() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
