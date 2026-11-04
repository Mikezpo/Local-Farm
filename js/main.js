import { BASKET_KEY, boxTypes, boxSizes, getProduct, formatMoney, changeQuantity, basketTotals, readBasket, saveBasket, normalizePostcode, emailLink, orderEmail, photo } from './catalog.js?v=5';
import { recipes, recipeCategories } from './recipes.js?v=6';
import { icon, mountSite } from './components.js?v=5';

mountSite();

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-navigation');
function closeMenu() {
  navigation?.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open menu');
}
menuButton?.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => {
  if (!navigation?.contains(event.target) && !menuButton?.contains(event.target)) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); }
});
matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);

// Dialogs live outside the mobile navigation. The native element manages focus containment.
let dialogOpener;
function openDialog(id) {
  closeMenu();
  document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
  dialogOpener = document.activeElement;
  document.getElementById(id).showModal();
  document.body.classList.add('dialog-open');
}
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    if (dialogOpener?.isConnected) dialogOpener.focus();
    if (dialog.id === 'account-dialog') resetAccount();
  });
  dialog.querySelector('[data-close-dialog]')?.addEventListener('click', () => dialog.close());
});
document.querySelectorAll('[data-open-account]').forEach(button => button.addEventListener('click', () => openDialog('account-dialog')));
document.querySelectorAll('[data-open-basket]').forEach(button => button.addEventListener('click', () => openDialog('basket-dialog')));

let accountMode = 'signin';
const accountForm = document.getElementById('account-form');
function setAccountMode(mode) {
  accountMode = mode;
  const signingUp = mode === 'signup';
  document.getElementById('account-title').textContent = signingUp ? 'Make yourself at home.' : 'Welcome back.';
  document.getElementById('account-submit').textContent = signingUp ? 'Preview sign up' : 'Preview sign in';
  document.getElementById('account-name-field').hidden = !signingUp;
  const name = document.getElementById('account-name');
  name.disabled = !signingUp; name.required = signingUp;
  document.getElementById('account-password').autocomplete = signingUp ? 'new-password' : 'current-password';
  document.getElementById('account-switch-copy').textContent = signingUp ? 'Already know your way around?' : 'New around here?';
  document.getElementById('account-switch').textContent = signingUp ? 'Preview sign in' : 'Preview sign up';
  document.getElementById('account-status').textContent = '';
}
function resetAccount() {
  accountForm.reset();
  document.getElementById('account-password').type = 'password';
  const toggle = document.querySelector('.password-toggle');
  toggle.textContent = 'Show'; toggle.setAttribute('aria-pressed', 'false'); toggle.setAttribute('aria-label', 'Show password');
  setAccountMode('signin');
}
document.getElementById('account-switch').addEventListener('click', () => {
  setAccountMode(accountMode === 'signin' ? 'signup' : 'signin');
  document.getElementById(accountMode === 'signup' ? 'account-name' : 'account-email').focus();
});
document.querySelector('.password-toggle').addEventListener('click', event => {
  const password = document.getElementById('account-password');
  const visible = password.type === 'password';
  password.type = visible ? 'text' : 'password';
  event.currentTarget.textContent = visible ? 'Hide' : 'Show';
  event.currentTarget.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
  event.currentTarget.setAttribute('aria-pressed', String(visible));
});
accountForm.addEventListener('submit', event => {
  event.preventDefault();
  document.getElementById('account-password').value = '';
  document.getElementById('account-status').textContent = 'Thanks for exploring. Online accounts are coming soon; no account was created or signed in. You can send an order enquiry from your basket.';
});

let storage;
try { storage = window.localStorage; } catch { /* The basket remains usable in memory. */ }
let basket = readBasket(storage);
let frequency = 'Weekly';
let postcode = '';
try { postcode = normalizePostcode(sessionStorage.getItem('local-farm.postcode')) || ''; } catch { /* Optional convenience only. */ }
const queryPostcode = normalizePostcode(new URLSearchParams(location.search).get('postcode'));
if (queryPostcode) postcode = queryPostcode;
const deliveryNote = document.querySelector('[data-delivery-note]');
if (deliveryNote && postcode) { deliveryNote.textContent = `Your postcode: ${postcode}. We’ll confirm delivery availability when you send your enquiry.`; deliveryNote.hidden = false; }

function renderBasket() {
  const totals = basketTotals(basket);
  document.querySelectorAll('[data-basket-count]').forEach(count => { count.textContent = totals.count; });
  document.querySelectorAll('[data-open-basket]').forEach(button => button.setAttribute('aria-label', `Open basket, ${totals.count} ${totals.count === 1 ? 'item' : 'items'}`));
  document.getElementById('basket-items').innerHTML = basket.length ? `<ul class="basket-list">${basket.map(item => {
    const product = getProduct(item.id);
    return `<li class="basket-item"><img src="${photo(boxTypes[product.type].image, 180)}" alt="" width="72" height="80"><div class="basket-item-info"><h3>${product.name}</h3><p>${formatMoney(product.price)} per box</p><div class="quantity-control"><button type="button" data-quantity="-1" data-product="${item.id}" aria-label="Decrease ${product.name} quantity">−</button><span aria-label="Quantity">${item.quantity}</span><button type="button" data-quantity="1" data-product="${item.id}" aria-label="Increase ${product.name} quantity"${item.quantity >= 99 ? ' disabled' : ''}>+</button></div></div><div class="basket-item-end"><strong>${formatMoney(product.price * item.quantity)}</strong><button class="inline-button" type="button" data-remove="${item.id}" aria-label="Remove ${product.name}">Remove</button></div></li>`;
  }).join('')}</ul>` : `<div class="empty-basket">${icon('bag')}<h3>Good things start with a box.</h3><p>Your basket is waiting for its first bit of goodness.</p><a class="button button-primary" href="boxes.html">Find your box ${icon('arrow')}</a></div>`;
  document.getElementById('basket-summary').hidden = !basket.length;
  document.getElementById('basket-total').textContent = formatMoney(totals.cents);
  const enquiry = orderEmail(basket, postcode, frequency);
  const orderLink = document.getElementById('order-enquiry');
  if (enquiry) orderLink.href = enquiry;
  else orderLink.removeAttribute('href');
}
let noticeTimer;
function notify(message) {
  const notice = document.getElementById('site-notice');
  notice.textContent = message; notice.classList.add('is-visible');
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => notice.classList.remove('is-visible'), 4000);
}
function updateBasket(id, difference, remove = false) {
  basket = remove ? basket.filter(item => item.id !== id) : changeQuantity(basket, id, difference);
  const saved = saveBasket(storage, basket);
  renderBasket();
  document.getElementById('basket-status').textContent = saved ? 'Basket updated.' : 'Basket updated for this visit. Your browser could not save it for later.';
}
document.getElementById('basket-items').addEventListener('click', event => {
  const quantityButton = event.target.closest('[data-quantity]');
  const removeButton = event.target.closest('[data-remove]');
  if (!quantityButton && !removeButton) return;
  const previousRow = event.target.closest('.basket-item');
  const index = Array.from(previousRow.parentElement.children).indexOf(previousRow);
  const id = quantityButton?.dataset.product || removeButton.dataset.remove;
  updateBasket(id, Number(quantityButton?.dataset.quantity || 0), Boolean(removeButton));
  const replacement = document.querySelector(`[data-product="${id}"][data-quantity="${quantityButton?.dataset.quantity || '-1'}"]`);
  const rows = document.querySelectorAll('.basket-item');
  const nextFocus = replacement && !replacement.disabled ? replacement : rows[Math.min(index, rows.length - 1)]?.querySelector('button');
  (nextFocus || document.querySelector('#basket-items a') || document.querySelector('#basket-dialog [data-close-dialog]')).focus();
});
document.getElementById('delivery-frequency').addEventListener('change', event => { frequency = event.target.value; renderBasket(); });
window.addEventListener('storage', event => {
  if (event.key === BASKET_KEY || event.key === null) { basket = readBasket(storage); renderBasket(); }
});
renderBasket();

// The displayed prices and basket calculations share the same catalogue.
const boxGrid = document.querySelector('[data-box-grid]');
function renderBoxes(type) {
  if (!boxGrid || !Object.hasOwn(boxTypes, type)) return;
  boxGrid.innerHTML = Object.entries(boxSizes).map(([size, details]) => {
    const product = getProduct(`${type}-${size}`);
    return `<article class="box-card${size === 'medium' ? ' is-featured' : ''}"><div class="box-card-top"><span class="box-size">${details.name}</span>${size === 'medium' ? '<span class="small-tag">A little more variety</span>' : ''}</div><img class="box-card-image" src="${photo(boxTypes[type].image, 650)}" alt="${boxTypes[type].alt}" width="600" height="400"><div class="box-card-content"><h2>${details.tagline}</h2><p>${details.description}</p><div class="box-price">${formatMoney(product.price)}<span> / box</span></div><ul class="box-includes"><li>${product.contents}</li><li>Seasonal selection, chosen with care</li><li>Weekly or fortnightly enquiries</li></ul><button class="button ${size === 'medium' ? 'button-primary' : 'button-outline'} full-width" type="button" data-add-product="${product.id}" aria-label="Add ${product.name} to basket">Add to basket ${icon('bag')}</button></div></article>`;
  }).join('');
}
if (boxGrid) {
  const requestedType = new URLSearchParams(location.search).get('type');
  const type = Object.hasOwn(boxTypes, requestedType) ? requestedType : 'mixed';
  const selected = document.querySelector(`input[name="box-type"][value="${type}"]`);
  if (selected) selected.checked = true;
  renderBoxes(type);
  document.querySelectorAll('input[name="box-type"]').forEach(input => input.addEventListener('change', () => {
    renderBoxes(input.value);
    document.getElementById('box-status').textContent = `${boxTypes[input.value].name} boxes selected. Prices and contents updated.`;
  }));
  boxGrid.addEventListener('click', event => {
    const button = event.target.closest('[data-add-product]');
    if (!button) return;
    const product = getProduct(button.dataset.addProduct);
    if (!product) return;
    if ((basket.find(item => item.id === product.id)?.quantity || 0) >= 99) { notify('You can add up to 99 of each box.'); return; }
    updateBasket(product.id, 1);
    notify(`${product.name} added to your basket.`);
    button.textContent = 'Added to basket ✓';
    setTimeout(() => { if (button.isConnected) button.innerHTML = `Add to basket ${icon('bag')}`; }, 1800);
  });
}

document.querySelector('[data-postcode-form]')?.addEventListener('submit', event => {
  event.preventDefault();
  const input = event.currentTarget.elements.postcode;
  const value = normalizePostcode(input.value);
  if (!value) { input.setCustomValidity('Enter a Portuguese postcode, such as 4450-123.'); input.reportValidity(); return; }
  try { sessionStorage.setItem('local-farm.postcode', value); } catch { /* Also carried in the next page URL. */ }
  location.href = `boxes.html?postcode=${encodeURIComponent(value)}`;
});
document.querySelector('[name="postcode"]')?.addEventListener('input', event => event.target.setCustomValidity(''));

// Explicit email drafts: never claim a message was sent or a subscription created.
document.querySelector('[data-contact-form]')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.elements.name.value.trim();
  const message = form.elements.message.value.trim();
  if (!name || !message) { document.getElementById('contact-status').textContent = 'Please enter your name and a message before preparing your email.'; return; }
  const draft = document.querySelector('[data-contact-draft]');
  draft.href = emailLink(`Local Farm — message from ${name}`, `Hello Local Farm,\n\n${message}\n\nFrom: ${name}\nReply to: ${form.elements.email.value.trim()}`);
  draft.hidden = false;
  document.getElementById('contact-status').textContent = 'Your email draft is ready. Open it in your email app, then send it to contact the farm.';
});
document.querySelector('[data-contact-form]')?.addEventListener('input', () => {
  const draft = document.querySelector('[data-contact-draft]'); draft.hidden = true; draft.removeAttribute('href');
  document.getElementById('contact-status').textContent = '';
});
document.querySelector('[data-newsletter-form]')?.addEventListener('submit', event => {
  event.preventDefault();
  const email = event.currentTarget.elements.email.value.trim();
  const draft = document.querySelector('[data-newsletter-draft]');
  draft.href = emailLink('Local Farm — seasonal updates', `Hello Local Farm,\n\nPlease send seasonal updates to ${email}.\n\nThank you!`);
  draft.hidden = false;
  document.querySelector('[data-newsletter-status]').textContent = 'Your signup request is ready. Open and send the email to request updates.';
});
document.querySelector('[data-newsletter-form] input')?.addEventListener('input', () => {
  const draft = document.querySelector('[data-newsletter-draft]'); draft.hidden = true; draft.removeAttribute('href');
  document.querySelector('[data-newsletter-status]').textContent = '';
});

const recipeGrid = document.querySelector('[data-recipe-grid]');
function recipeCard(recipe) {
  return `<article class="recipe-card"><button type="button" class="recipe-image-button" data-recipe="${recipe.id}" aria-label="Read ${recipe.name}"><img src="${photo(recipe.image, 750)}" alt="Seasonal food inspiration for ${recipe.name.toLowerCase()}" width="600" height="450" loading="lazy"><span class="recipe-time">${recipe.time}</span></button><div class="recipe-card-content"><span class="eyebrow">${recipeCategories[recipe.category]}</span><h3><button class="recipe-title-button" type="button" data-recipe="${recipe.id}">${recipe.name}</button></h3><p>${recipe.description}</p><button class="text-link" type="button" data-recipe="${recipe.id}">To the kitchen ${icon('arrow')}</button></div></article>`;
}
function renderRecipes(category = 'all') {
  if (!recipeGrid) return;
  const visible = recipes.filter(recipe => category === 'all' || recipe.category === category);
  recipeGrid.innerHTML = visible.map(recipeCard).join('');
  document.querySelectorAll('[data-recipe-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.recipeFilter === category)));
  const count = document.getElementById('recipe-count');
  if (count) count.textContent = `${visible.length} ${visible.length === 1 ? 'recipe' : 'recipes'} to make something good.`;
}
renderRecipes();
document.querySelector('[data-recipe-preview]')?.insertAdjacentHTML('afterbegin', ['garden-bowl', 'lemon-pasta', 'berry-pots'].map(id => recipes.find(recipe => recipe.id === id)).filter(Boolean).map(recipeCard).join(''));
document.querySelectorAll('[data-recipe-filter]').forEach(button => button.addEventListener('click', () => renderRecipes(button.dataset.recipeFilter)));
document.addEventListener('click', event => {
  const button = event.target.closest('[data-recipe]');
  if (!button) return;
  const recipe = recipes.find(item => item.id === button.dataset.recipe);
  if (!recipe) return;
  document.getElementById('recipe-detail').innerHTML = `<img class="recipe-detail-image" src="${photo(recipe.image, 1000)}" alt="Seasonal food inspiration" width="900" height="450"><span class="eyebrow">${recipeCategories[recipe.category]} · ${recipe.time} · Serves ${recipe.serves}</span><h2 id="recipe-title">${recipe.name}</h2><p>${recipe.description}</p><div class="recipe-instructions"><section><h3>What you’ll need</h3><ul>${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}</ul></section><section><h3>Let’s make it</h3><ol>${recipe.steps.map(step => `<li>${step}</li>`).join('')}</ol></section></div>`;
  openDialog('recipe-dialog');
});
