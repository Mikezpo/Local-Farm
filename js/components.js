import { FARM_EMAIL } from './catalog.js?v=5';

const icons = {
  leaf: '<path d="M20 4C11 2 3 6 5 14c7 4 15-1 15-10Z"/><path d="M4 21c1-6 5-10 11-13"/>',
  bag: '<path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 22v-2a8 8 0 0 1 16 0v2"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
};
export const icon = name => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.leaf}</svg>`;

export function mountSite() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  const links = [['boxes.html', 'Our boxes'], ['howitworks.html', 'How it works'], ['about.html', 'Our story'], ['recipes.html', 'Recipes']];
  document.querySelector('[data-site-header]')?.insertAdjacentHTML('afterbegin', `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <div class="header-inner wrap">
      <a class="brand" href="index.html" aria-label="Local Farm home">${icon('leaf')}<span>Local Farm<span class="brand-dot">.</span></span></a>
      <nav id="site-navigation" class="site-navigation" aria-label="Main navigation">${links.map(([href, text]) => `<a href="${href}"${currentPage === href ? ' aria-current="page"' : ''}>${text}</a>`).join('')}</nav>
      <div class="header-actions">
        <button class="icon-button account-trigger" type="button" data-open-account aria-label="Open account preview" aria-haspopup="dialog">${icon('user')}</button>
        <button class="basket-trigger" type="button" data-open-basket aria-haspopup="dialog" aria-label="Open basket, 0 items">${icon('bag')}<span class="basket-label">Basket</span><span class="basket-count" data-basket-count>0</span></button>
        <button class="icon-button menu-toggle" type="button" aria-controls="site-navigation" aria-expanded="false" aria-label="Open menu">${icon('menu')}</button>
      </div>
    </div>`);
  document.querySelector('[data-site-footer]')?.insertAdjacentHTML('afterbegin', `
    <section class="newsletter wrap" aria-labelledby="newsletter-heading">
      <div><span class="eyebrow light">A little goodness in your inbox</span><h2 id="newsletter-heading">Stay close to the farm.</h2><p>Seasonal inspiration, simple recipes, and news from our little corner of Portugal.</p></div>
      <form data-newsletter-form>
        <label for="newsletter-email">Your email address</label>
        <div class="input-action"><input id="newsletter-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required maxlength="254"><button class="button button-cream" type="submit">Request updates ${icon('arrow')}</button></div>
        <p class="form-hint">Prepare an email to request updates. Nothing is subscribed automatically.</p>
        <p class="form-status" data-newsletter-status role="status"></p><a class="text-link light" data-newsletter-draft hidden>Open signup email ${icon('arrow')}</a>
      </form>
    </section>
    <div class="footer-bottom wrap"><div><a class="brand" href="index.html">${icon('leaf')}<span>Local Farm.</span></a><p>Good food. Less waste. Closer to home.</p></div><nav aria-label="Footer navigation"><a href="about.html">Our story</a><a href="about.html#contact">Get in touch</a><a href="mailto:${FARM_EMAIL}">${FARM_EMAIL}</a></nav></div>
    <div class="footer-fine wrap"><span>© ${new Date().getFullYear()} Local Farm · A farm-to-door concept.</span><span>Created by <a href="https://joseoliveira.netlify.app/" rel="noopener">José Oliveira</a></span></div>`);
  document.body.insertAdjacentHTML('beforeend', `
    <div class="toast" id="site-notice" role="status" aria-live="polite"></div>
    <dialog class="site-dialog account-dialog" id="account-dialog" aria-labelledby="account-title" aria-describedby="account-intro">
      <div class="dialog-body"><button class="dialog-close icon-button" type="button" data-close-dialog aria-label="Close account preview">${icon('close')}</button>
        <span class="eyebrow">Your little corner of the farm</span><h2 id="account-title">Welcome back.</h2>
        <p id="account-intro">Online accounts are coming soon. You can explore this preview and send order enquiries without an account.</p>
        <form id="account-form" method="dialog">
          <div id="account-name-field" hidden><label for="account-name">Your name</label><input id="account-name" name="name" autocomplete="name" maxlength="100" disabled></div>
          <label for="account-email">Email address</label><input id="account-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required maxlength="254">
          <label for="account-password">Password</label><div class="password-field"><input id="account-password" name="password" type="password" autocomplete="current-password" required minlength="8" maxlength="128" aria-describedby="account-password-hint"><button type="button" class="password-toggle" aria-controls="account-password" aria-pressed="false" aria-label="Show password">Show</button></div>
          <p class="form-hint" id="account-password-hint">Preview only. Use a sample password of at least 8 characters; it is never saved or sent.</p>
          <button class="button button-primary full-width" id="account-submit" type="submit">Preview sign in ${icon('arrow')}</button>
          <p class="form-status" id="account-status" role="status"></p>
        </form>
        <p class="account-switch"><span id="account-switch-copy">New around here?</span> <button class="inline-button" type="button" id="account-switch">Preview sign up</button></p>
        <a class="text-link" href="boxes.html">Browse boxes without an account ${icon('arrow')}</a>
      </div>
    </dialog>
    <dialog class="site-dialog basket-dialog" id="basket-dialog" aria-labelledby="basket-title">
      <div class="dialog-body"><button class="dialog-close icon-button" type="button" data-close-dialog aria-label="Close basket">${icon('close')}</button><span class="eyebrow">A little box of good things</span><h2 id="basket-title">Your basket.</h2>
        <div id="basket-items"></div>
        <div id="basket-summary" hidden><div class="basket-subtotal"><span>Produce subtotal</span><strong id="basket-total"></strong></div><label for="delivery-frequency">Preferred delivery rhythm</label><select id="delivery-frequency"><option>Weekly</option><option>Fortnightly</option></select><p class="form-hint">Availability, delivery coverage, any delivery charge, and the final total are confirmed by email. No payment is taken here.</p><a class="button button-primary full-width" id="order-enquiry">Prepare order email ${icon('arrow')}</a></div>
        <p class="form-status" id="basket-status" role="status"></p>
      </div>
    </dialog>
    <dialog class="site-dialog recipe-dialog" id="recipe-dialog" aria-labelledby="recipe-title"><div class="dialog-body"><button class="dialog-close icon-button" type="button" data-close-dialog aria-label="Close recipe">${icon('close')}</button><div id="recipe-detail"><h2 id="recipe-title">Seasonal recipe</h2></div></div></dialog>`);
}
