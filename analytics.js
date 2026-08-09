(() => {
  'use strict';

  const measurementId = 'G-58Q2WPMLMN';

  function track(eventName, parameters = {}) {
    if (typeof window.gtag !== 'function') return false;

    window.gtag('event', eventName, {
      send_to: measurementId,
      page_title: document.title,
      page_location: window.location.href,
      transport_type: 'beacon',
      ...parameters
    });

    return true;
  }

  window.TrustedIntentAnalytics = { track };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-analytics-event]');
    if (!link) return;

    track(link.dataset.analyticsEvent, {
      link_text: link.textContent.trim().replace(/\s+/g, ' '),
      link_url: link.href,
      cta_location: link.dataset.analyticsLocation || 'unspecified'
    });
  });

  document.addEventListener('submit', (event) => {
    const form = event.target.closest('form[data-analytics-form="book-updates"]');
    if (!form || form.dataset.analyticsSubmitted === 'true') return;

    event.preventDefault();
    form.dataset.analyticsSubmitted = 'true';

    let resumed = false;
    const continueSubmission = () => {
      if (resumed) return;
      resumed = true;
      HTMLFormElement.prototype.submit.call(form);
    };

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'sign_up', {
        send_to: measurementId,
        method: 'mailchimp',
        form_name: 'book_updates',
        page_title: document.title,
        page_location: window.location.href,
        transport_type: 'beacon',
        event_callback: continueSubmission,
        event_timeout: 800
      });

      window.setTimeout(continueSubmission, 900);
    } else {
      continueSubmission();
    }
  });
})();
