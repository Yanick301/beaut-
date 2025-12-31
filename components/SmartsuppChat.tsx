'use client';

import Script from 'next/script';

export default function SmartsuppChat() {
  return (
    <>
      <Script
        id="smartsupp-script"
        src="https://www.smartsuppchat.com/loader.js?"
        strategy="afterInteractive"
      />
      <Script
        id="smartsupp-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.smartsupp = window.smartsupp || {};
            window.smartsupp.key = '27918820574ca61c1750dcb48c456fa20666a40d';
          `,
        }}
      />
      <noscript>
        Powered by{' '}
        <a href="https://www.smartsupp.com" target="_blank" rel="noopener noreferrer">
          Smartsupp
        </a>
      </noscript>
    </>
  );
}