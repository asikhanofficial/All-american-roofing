/**
 * All American Roofing — Oakley, CA
 * Main Frontend Interaction Script (Vanilla JS, Zero Dependencies)
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. Desktop Navigation Dropdowns (Hover + Click + Keyboard Accessible)
     ------------------------------------------------------------------------ */
  const dropdownItems = Array.from(document.querySelectorAll('.nav-item[data-dropdown]'));

  function closeAllDropdowns(exceptItem) {
    dropdownItems.forEach(function (item) {
      if (item !== exceptItem) {
        item.classList.remove('is-open');
        const trigger = item.querySelector('.nav-dropdown-trigger');
        if (trigger) {
          trigger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  dropdownItems.forEach(function (item) {
    const trigger = item.querySelector('.nav-dropdown-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      const willOpen = !item.classList.contains('is-open');
      closeAllDropdowns(item);
      item.classList.toggle('is-open', willOpen);
      trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.nav-item[data-dropdown]')) {
      closeAllDropdowns(null);
    }
  });

  /* ------------------------------------------------------------------------
     2. Mobile Navigation Drawer & Submenu Toggles
     ------------------------------------------------------------------------ */
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');

  function setMobileDrawer(open) {
    if (!mobileToggle || !mobileDrawer) return;
    mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileDrawer.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', function () {
      const isOpen = mobileToggle.getAttribute('aria-expanded') === 'true';
      setMobileDrawer(!isOpen);
    });

    mobileDrawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMobileDrawer(false);
      });
    });
  }

  document.querySelectorAll('.mobile-submenu-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetId = btn.getAttribute('aria-controls');
      const panel = targetId ? document.getElementById(targetId) : null;
      if (!panel) return;
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      panel.hidden = expanded;
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeAllDropdowns(null);
      if (mobileToggle && mobileToggle.getAttribute('aria-expanded') === 'true') {
        setMobileDrawer(false);
        mobileToggle.focus();
      }
    }
  });

  /* ------------------------------------------------------------------------
     3. FAQ Accordions
     ------------------------------------------------------------------------ */
  document.querySelectorAll('.faq-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const panelId = trigger.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      panel.hidden = isExpanded;
    });
  });

  /* ------------------------------------------------------------------------
     4. Filter Tabs (Services & Projects Directory Filtering)
     ------------------------------------------------------------------------ */
  document.querySelectorAll('[data-filter-bar]').forEach(function (bar) {
    const targetSelector = bar.getAttribute('data-filter-target');
    const items = targetSelector ? Array.from(document.querySelectorAll(targetSelector)) : [];
    const buttons = Array.from(bar.querySelectorAll('.filter-tab'));

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filterValue = btn.getAttribute('data-filter') || 'all';
        buttons.forEach(function (other) {
          const active = other === btn;
          other.classList.toggle('is-active', active);
          other.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        items.forEach(function (card) {
          const category = card.getAttribute('data-category') || '';
          const match = filterValue === 'all' || category.split(/\s+/).includes(filterValue);
          card.hidden = !match;
        });
      });
    });
  });

  /* ------------------------------------------------------------------------
     5. Estimate Request Form Validation & Configurable Submission Handler
     ------------------------------------------------------------------------ */
  const estimateForm = document.getElementById('estimate-form');
  if (estimateForm) {
    const statusBox = document.getElementById('form-status');

    function setFieldError(field, message) {
      const errorEl = document.getElementById(field.id + '-error');
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (errorEl) {
        errorEl.textContent = message || '';
      }
    }

    function validateField(field) {
      const value = (field.value || '').trim();
      const name = field.name;

      if (field.hasAttribute('required') && !value) {
        setFieldError(field, 'This field is required.');
        return false;
      }

      if (name === 'phone' && value) {
        const digits = value.replace(/\D/g, '');
        if (digits.length < 10) {
          setFieldError(field, 'Please enter a valid 10-digit phone number.');
          return false;
        }
      }

      if (name === 'email' && value) {
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
        if (!emailOk) {
          setFieldError(field, 'Please enter a valid email address.');
          return false;
        }
      }

      setFieldError(field, '');
      return true;
    }

    const formFields = Array.from(estimateForm.querySelectorAll('input, select, textarea'));
    formFields.forEach(function (field) {
      field.addEventListener('blur', function () {
        validateField(field);
      });
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') {
          validateField(field);
        }
      });
    });

    estimateForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      let allValid = true;
      let firstInvalid = null;
      formFields.forEach(function (field) {
        if (!validateField(field)) {
          allValid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (!allValid) {
        if (statusBox) {
          statusBox.hidden = false;
          statusBox.className = 'form-status form-status--error';
          statusBox.textContent = 'Please review the highlighted fields before submitting your estimate request.';
        }
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      /**
       * PRODUCTION ENDPOINT CONFIGURATION:
       * Set data-form-endpoint="https://your-form-endpoint.example/submit" on #estimate-form
       * (for example Formspree, Basin, or a server-side mail handler).
       */
      const endpoint = (estimateForm.getAttribute('data-form-endpoint') || '').trim();
      const submitBtn = estimateForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';

      if (!endpoint) {
        if (statusBox) {
          statusBox.hidden = false;
          statusBox.className = 'form-status form-status--success';
          statusBox.innerHTML =
            '<strong>Form details validated.</strong> Online form transmission requires connecting a live submission endpoint in <code>data-form-endpoint</code>. For immediate estimate scheduling in Oakley and East Contra Costa County, please call <a href="tel:+18552350472">(855) 235-0472</a>.';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Request...';
      }

      try {
        const formData = new FormData(estimateForm);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData
        });

        if (!response.ok) {
          throw new Error('Submission returned status ' + response.status);
        }

        estimateForm.reset();
        if (statusBox) {
          statusBox.hidden = false;
          statusBox.className = 'form-status form-status--success';
          statusBox.innerHTML =
            '<strong>Estimate request received.</strong> Thank you for contacting All American Roofing. You may also reach us directly at <a href="tel:+18552350472">(855) 235-0472</a>.';
        }
      } catch (err) {
        if (statusBox) {
          statusBox.hidden = false;
          statusBox.className = 'form-status form-status--error';
          statusBox.innerHTML =
            'Unable to send the request right now. Please call <a href="tel:+18552350472">(855) 235-0472</a> directly so we can assist you.';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  }

  /* ------------------------------------------------------------------------
     6. Resilient Local Image Fallback Handler
     ------------------------------------------------------------------------ */
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
      const parent = img.parentElement;
      if (!parent || parent.dataset.fallbackApplied) return;
      parent.dataset.fallbackApplied = 'true';
      img.style.display = 'none';
      const fallback = document.createElement('div');
      fallback.className = 'img-fallback-box';
      const label = document.createElement('span');
      label.className = 'img-fallback-label';
      label.textContent = img.getAttribute('alt') || 'All American Roofing — Oakley, CA';
      fallback.appendChild(label);
      parent.appendChild(fallback);
    });
  });
})();
