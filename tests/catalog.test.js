import test from 'node:test';
import assert from 'node:assert/strict';
import { BASKET_KEY, products, getProduct, sanitizeBasket, changeQuantity, basketTotals, readBasket, saveBasket, normalizePostcode, emailLink, orderEmail } from '../js/catalog.js';
import { recipes, recipeCategories } from '../js/recipes.js';

test('catalogue has nine distinct products, with prices in whole cents', () => {
  assert.equal(products.length, 9);
  assert.equal(new Set(products.map(product => product.id)).size, 9);
  assert.ok(products.every(product => Number.isInteger(product.price) && product.price > 0));
  assert.equal(getProduct('mixed-small').price, 1199);
  assert.equal(getProduct('fruit-small').price, 999);
});

test('basket rejects unknown products and invalid quantities without trusting saved prices', () => {
  assert.deepEqual(sanitizeBasket([
    null, {}, { id: '<script>', quantity: 1 }, { id: 'mixed-small', quantity: '2' },
    { id: 'mixed-small', quantity: -1 }, { id: 'mixed-small', quantity: 1.5 },
    { id: 'mixed-small', quantity: Infinity }, { id: 'mixed-small', quantity: 2, price: 1 },
  ]), [{ id: 'mixed-small', quantity: 2 }]);
  assert.deepEqual(sanitizeBasket({ id: 'mixed-small', quantity: 2 }), []);
  assert.equal(basketTotals([{ id: 'mixed-small', quantity: 2, price: 1 }]).cents, 2398);
});

test('duplicate items merge and quantities stay bounded', () => {
  assert.deepEqual(sanitizeBasket([{ id: 'fruit-large', quantity: 80 }, { id: 'fruit-large', quantity: 30 }]), [{ id: 'fruit-large', quantity: 99 }]);
  assert.deepEqual(changeQuantity([{ id: 'fruit-large', quantity: 99 }], 'fruit-large', 1), [{ id: 'fruit-large', quantity: 99 }]);
});

test('quantity changes do not mutate the previous basket', () => {
  const previous = [{ id: 'mixed-small', quantity: 1 }];
  const next = changeQuantity(previous, 'mixed-small', 1);
  assert.equal(next[0].quantity, 2);
  assert.equal(previous[0].quantity, 1);
  assert.deepEqual(changeQuantity(previous, 'fruit-large', 1), [...previous, { id: 'fruit-large', quantity: 1 }]);
});

test('decreasing the final unit removes it, with no negative or phantom items', () => {
  assert.deepEqual(changeQuantity([{ id: 'mixed-small', quantity: 1 }], 'mixed-small', -1), []);
  assert.deepEqual(changeQuantity([], 'mixed-small', -1), []);
  assert.deepEqual(changeQuantity([], 'unknown', 1), []);
  assert.deepEqual(changeQuantity([], 'mixed-small', NaN), []);
});

test('mixed product totals use exact integer arithmetic', () => {
  assert.deepEqual(basketTotals([{ id: 'mixed-small', quantity: 2 }, { id: 'fruit-large', quantity: 1 }]), { count: 3, cents: 4297 });
  assert.deepEqual(basketTotals([]), { count: 0, cents: 0 });
});

test('basket round-trips through storage and recovers from corrupted data', () => {
  const data = new Map();
  const storage = { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value) };
  const basket = [{ id: 'veggie-medium', quantity: 3 }];
  assert.equal(saveBasket(storage, basket), true);
  assert.deepEqual(readBasket(storage), basket);
  data.set(BASKET_KEY, '{ broken json');
  assert.deepEqual(readBasket(storage), []);
  data.set(BASKET_KEY, 'null');
  assert.deepEqual(readBasket(storage), []);
});

test('unavailable browser storage never prevents in-memory shopping', () => {
  const blocked = { getItem() { throw new Error('Blocked'); }, setItem() { throw new Error('Quota'); } };
  assert.deepEqual(readBasket(blocked), []);
  assert.equal(saveBasket(blocked, []), false);
  assert.deepEqual(readBasket(undefined), []);
  assert.equal(saveBasket(undefined, []), false);
});

test('Portuguese postcode normalization accepts formatting, not arbitrary input', () => {
  assert.equal(normalizePostcode(' 4450-123 '), '4450-123');
  assert.equal(normalizePostcode('4450123'), '4450-123');
  for (const value of ['', null, '4450', '4450-1234', 'ABCD-123', '4450-123\nBcc:test@example.com']) assert.equal(normalizePostcode(value), null);
});

test('email subjects and bodies are encoded without creating extra mail headers', () => {
  const subject = 'A & B? #hello';
  const body = 'A message\n&bcc=unexpected@example.com';
  const link = new URL(emailLink(subject, body));
  assert.equal(link.searchParams.get('subject'), subject);
  assert.equal(link.searchParams.get('body'), body);
  assert.equal(link.searchParams.has('bcc'), false);
});

test('order drafts include products, exact subtotal, postcode, and confirmation requirements', () => {
  const link = new URL(orderEmail([{ id: 'mixed-small', quantity: 2 }], '4450123', 'Fortnightly'));
  const body = link.searchParams.get('body');
  assert.match(body, /2 × Small fruit & veg box/);
  assert.match(body, /€23\.98/);
  assert.match(body, /Postcode: 4450-123/);
  assert.match(body, /Preferred delivery: Fortnightly/);
  assert.match(body, /delivery charge, and the final total/);
  assert.equal(orderEmail([], '4450123'), null);
  assert.doesNotMatch(new URL(orderEmail([{ id: 'fruit-small', quantity: 1 }], '<invalid>', 'unknown')).searchParams.get('body'), /<invalid>|unknown/);
});

test('every meal filter has a recipe with complete ingredients and instructions', () => {
  assert.equal(new Set(recipes.map(recipe => recipe.id)).size, recipes.length);
  for (const category of Object.keys(recipeCategories).filter(category => category !== 'all')) {
    assert.ok(recipes.some(recipe => recipe.category === category), `Missing ${category}`);
  }
  assert.ok(recipes.every(recipe => recipe.ingredients.length >= 4 && recipe.steps.length >= 3 && recipe.serves > 0));
});
