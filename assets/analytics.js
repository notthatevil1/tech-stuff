(() => {
  const eventForLink = (link) => {
    const href = link.getAttribute('href') || '';

    if (href.startsWith('tel:')) return ['click_to_call', 'call'];
    if (href.startsWith('sms:')) return ['click_to_text', 'text'];
    if (href.startsWith('mailto:')) return ['click_to_email', 'email'];
    if (href.includes('docs.google.com/forms/')) return ['open_contact_form', 'form'];
    if (href.startsWith('https://g.page/r/')) return ['click_review_link', 'review'];
    if (href.includes('google.com/maps?cid=')) return ['click_maps_listing', 'maps'];

    return null;
  };

  const locationForLink = (link) => {
    if (link.closest('.mobile-contact')) return 'mobile_contact_bar';
    if (link.closest('.contact-options')) return 'contact_options';
    if (link.closest('.header-cta')) return 'header';
    if (link.closest('.aside')) return 'service_sidebar';
    if (link.closest('.final-cta')) return 'final_call_to_action';
    if (link.closest('.site-footer')) return 'footer';
    return 'page_content';
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;

    const trackedEvent = eventForLink(link);
    if (!trackedEvent || typeof window.gtag !== 'function') return;

    const [eventName, contactMethod] = trackedEvent;
    window.gtag('event', eventName, {
      contact_method: contactMethod,
      element_location: locationForLink(link),
      page_path: window.location.pathname,
      transport_type: 'beacon'
    });
  });
})();
