'use client';

import Script from 'next/script';

export default function SmartsuppChat() {
  return (
    <>
      <Script
        id="smartsupp-full"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `var _smartsupp = _smartsupp || {};
_smartsupp.key = '27918820574ca61c1750dcb48c456fa20666a40d';
(function(d) {
  var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
  s=d.getElementsByTagName('script')[0];c=d.createElement('script');
  c.type='text/javascript';c.charset='utf-8';c.async=true;
  c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
})(document);`,
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