# Local Farm

A seasonal produce storefront, built with HTML, CSS, and vanilla JavaScript. Five responsive pages introduce the farm, explain the ordering process, offer a fruit and vegetable catalogue, and share seasonal recipes.

## Run locally

No dependency installation or build step is needed. Start a static server from the project root:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open [Local Farm](http://127.0.0.1:8765). With Node.js 20+ and Python 3 installed, `npm run dev` starts the same server. Use HTTP rather than opening the HTML files directly, because the JavaScript uses ES modules.

## Features

- Shared navigation, footer, and native dialogs across all five pages.
- Keyboard accessible mobile navigation, visible form labels, focus indicators, reduced motion support, and responsive layouts.
- Nine produce boxes across three categories, using the original project's prices and variety counts.
- Basket quantities, removal, exact cent-based totals, and persistence in local storage. Invalid saved data is discarded; storage failures fall back to an in-memory basket.
- Portuguese postcode format validation. A postcode is retained in session storage for inclusion in an order enquiry; the site does not assert delivery coverage.
- Order, contact, and newsletter email drafts with properly encoded subjects and bodies. Draft creation does not send email or create a subscription. Visitors choose whether to open and send each draft in their email app.
- Eighteen recipes with meal filters, ingredients, instructions, and accessible detail dialogs. Every meal category has at least three recipes to explore.
- An explicitly labelled account preview with sign-in/sign-up switching and password visibility. Passwords are never stored or transmitted and are cleared on close or submission.

## Project structure

```text
index.html          Homepage
boxes.html          Produce category and size selection
about.html          Farm story and contact form
howitworks.html     Ordering guide and FAQs
recipes.html        Recipe collection
css/styles.css      Shared visual design and responsive rules
js/catalog.js       Product data, basket operations, postcode validation, email drafts
js/components.js    Shared header, footer, and dialog markup
js/main.js          UI interactions
js/recipes.js       Recipe data
images/favicon.svg  Local Farm mark
tests/              Node.js tests for catalogue, basket, validation, and email drafts
```

## Checks

With Node.js 20+:

```sh
npm test
```

Tests cover corrupted/unavailable storage, untrusted basket data, quantity bounds, exact totals, postcode formats, email encoding, order enquiry contents, and recipe completeness. Browser checks should also cover navigation, dialogs, forms, filters, basket persistence, and narrow screens.

## Production integrations

This remains a frontend project. Account authentication, payments, confirmed delivery coverage, and automated mailing lists require service integrations. The account preview deliberately does not simulate successful authentication. Basket actions and email drafts create no order or payment commitment.

Before using this for a real business, replace the original example email address (`hello@localfarm.com`) and business copy with verified details. The shared email destination is exported as `FARM_EMAIL` in `js/catalog.js`; update the visible contact and no-JavaScript fallback links in the HTML as well. Product data and prices are in the same module.

## Imagery and credits

Photography is hosted on Unsplash. Existing project imagery has been retained where suitable. The mixed produce photograph is by [Snappr on Unsplash](https://unsplash.com/photos/a-wooden-box-filled-with-lots-of-different-types-of-vegetables-4zmSK0F4FPM), available under the Unsplash License. Additional recipe imagery includes [Joseph Gonzalez’s avocado toast](https://unsplash.com/photos/sandwich-with-boiled-egg-fdlZBWIP0aM) and [Karyna Panchenko’s pumpkin soup](https://unsplash.com/photos/a-bowl-of-carrot-soup-with-parsley-on-top-2beCqCd8mAc). Images illustrate seasonal produce and recipe inspiration; actual box contents vary.

Original concept and project by [José Oliveira](https://joseoliveira.netlify.app/). MIT licensed; see [LICENSE](LICENSE).
