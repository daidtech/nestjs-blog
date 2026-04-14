---
description: "Enforce Tailwind CSS as the primary UI styling method in the /web frontend. Allow custom CSS only for special cases. Applies to all React/Next.js files in /web."
applyTo:
  - web/app/**/*.tsx
  - web/app/**/*.ts
  - web/components/**/*.tsx
  - web/components/**/*.ts
---

# Tailwind CSS UI Styling Instruction

- Use Tailwind CSS utility classes for all UI in the /web frontend.
- Custom CSS is allowed only for special cases (e.g., complex layouts, third-party widgets) and should be documented in code comments.
- Do not introduce other CSS frameworks (e.g., Bootstrap, Material UI) unless discussed with the team.
- When reviewing PRs, ensure new UI code follows this convention.

## Example Prompts
- "Add a new button component using Tailwind CSS."
- "Refactor this form to use Tailwind utility classes."
- "How should I style a modal with Tailwind in this project?"

## Related Customizations
- See WORKSPACE_INSTRUCTIONS.md for full project workflow and coding standards.
