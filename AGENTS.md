# Project conventions

## CSS formatting

Follow the user's preferred expanded CSS structure for all stylesheet changes:

- Put each declaration on its own line, including rules with only one declaration.
- Write the opening brace after the selector and the closing brace on its own line.
- Use two spaces for indentation, with another level inside media queries.
- Put each selector in a comma-separated selector list on its own line.
- Leave a blank line between rule blocks.
- Do not compress rules or multiple declarations onto a single line.
- Keep styling in stylesheets rather than HTML `style` attributes.

Example:

```css
@media screen and (max-width: 670px) {
  .containerTwo {
    margin: 0 auto;
    flex-direction: column;
    width: 100%;
  }

  .boxImage {
    display: none;
  }
}
```

When reformatting CSS, preserve selectors, values, and rule order.
