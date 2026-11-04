export const FARM_EMAIL = 'hello@localfarm.com';
export const BASKET_KEY = 'local-farm.basket.v1';

export const boxTypes = {
  mixed: { name: 'Fruit & veg', label: 'fruit & veg', image: 'photo-1734772451376-0dd8003cb8f2', alt: 'A colourful selection of fresh seasonal produce' },
  veggie: { name: 'Just vegetables', label: 'veggie', image: 'photo-1587334207407-deb137a955ba', alt: 'Fresh vegetables ready for the kitchen' },
  fruit: { name: 'Just fruit', label: 'fruit', image: 'photo-1582281298055-e25b84a30b0b', alt: 'A selection of fresh fruit' },
};
export const boxSizes = {
  small: { name: 'Small', tagline: 'A little box of possibility.', description: 'A lovely starting point for smaller households and lighter weeks.' },
  medium: { name: 'Medium', tagline: 'The happy middle ground.', description: 'More variety for everyday cooking, sharing, and trying something new.' },
  large: { name: 'Large', tagline: 'More good food to go around.', description: 'Our biggest selection, for busy kitchens and tables with extra places.' },
};
const prices = { mixed: [1199, 1599, 1999], veggie: [1199, 1399, 1599], fruit: [999, 1399, 1899] };
const contents = {
  mixed: ['7 types of veg & 4 types of fruit', '9 types of veg & 4 types of fruit', '10 types of veg & 5 types of fruit'],
  veggie: ['6 varieties of vegetables', '8 varieties of vegetables', '10 varieties of vegetables'],
  fruit: ['5 varieties of fruit', '8 varieties of fruit', '10 varieties of fruit'],
};
export const products = Object.entries(boxTypes).flatMap(([type, details]) =>
  Object.entries(boxSizes).map(([size, info], index) => ({
    id: `${type}-${size}`, type, size, name: `${info.name} ${details.label} box`,
    price: prices[type][index], contents: contents[type][index],
  })),
);
export function getProduct(id) { return products.find(product => product.id === id); }
export function formatMoney(cents) {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

// Stored data is untrusted: accept only known products and bounded integer quantities.
export function sanitizeBasket(value) {
  if (!Array.isArray(value)) return [];
  const quantities = new Map();
  for (const item of value) {
    if (!item || !getProduct(item.id) || !Number.isInteger(item.quantity) || item.quantity < 1) continue;
    quantities.set(item.id, Math.min(99, (quantities.get(item.id) || 0) + item.quantity));
  }
  return Array.from(quantities, ([id, quantity]) => ({ id, quantity }));
}
export function changeQuantity(basket, id, difference) {
  const next = sanitizeBasket(basket);
  if (!getProduct(id) || !Number.isInteger(difference)) return next;
  const item = next.find(entry => entry.id === id);
  const quantity = Math.min(99, (item?.quantity || 0) + difference);
  if (quantity <= 0) return next.filter(entry => entry.id !== id);
  if (item) item.quantity = quantity;
  else next.push({ id, quantity });
  return next;
}
export function basketTotals(basket) {
  return sanitizeBasket(basket).reduce((total, item) => ({
    count: total.count + item.quantity,
    cents: total.cents + getProduct(item.id).price * item.quantity,
  }), { count: 0, cents: 0 });
}
export function readBasket(storage) {
  try { return sanitizeBasket(JSON.parse(storage.getItem(BASKET_KEY) || '[]')); }
  catch { return []; }
}
export function saveBasket(storage, basket) {
  try { storage.setItem(BASKET_KEY, JSON.stringify(sanitizeBasket(basket))); return true; }
  catch { return false; }
}
export function normalizePostcode(value) {
  if (typeof value !== 'string') return null;
  const match = value.trim().match(/^(\d{4})-?(\d{3})$/);
  return match ? `${match[1]}-${match[2]}` : null;
}
export function emailLink(subject, body) {
  return `mailto:${FARM_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
export function orderEmail(basket, postcode, frequency = 'Weekly') {
  const items = sanitizeBasket(basket);
  if (!items.length) return null;
  const lines = items.map(item => `${item.quantity} × ${getProduct(item.id).name} — ${formatMoney(getProduct(item.id).price * item.quantity)}`);
  const delivery = normalizePostcode(postcode);
  return emailLink('Local Farm — order enquiry', [
    'Hello Local Farm,', '', 'I would like to enquire about:', ...lines, '',
    `Produce subtotal: ${formatMoney(basketTotals(items).cents)}`,
    `Preferred delivery: ${frequency === 'Fortnightly' ? 'Fortnightly' : 'Weekly'}`,
    ...(delivery ? [`Postcode: ${delivery}`] : []), '',
    'Please confirm availability, delivery coverage, any delivery charge, and the final total before arranging my order.',
  ].join('\n'));
}
export function photo(id, width = 900) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
}
