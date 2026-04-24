---
name: feature-testing
user-invocable: true
description: "Use when changing backend APIs or frontend features so the assistant adds or updates Jest/Node spec tests and validates the feature.
This skill encourages adding tests for new behavior and running the relevant test suites before marking work as complete."
---

# Feature Testing Skill

## When to use

- Adding a backend API endpoint or changing API request/response behavior
- Adding a frontend feature or changing UI behavior
- Implementing a new feature that needs automated coverage
- Updating validation, authorization, or error handling logic

## What this skill enforces

- Add or update tests for the changed feature
- Prefer tests in `src/**/*.spec.ts`, `test/**/*.spec.ts`, or `web/**/*.spec.ts` / `web/**/*.test.ts`
- Run the relevant suite and confirm the code passes
- If the feature spans both backend and frontend, cover both sides

## Guidance for the assistant

- Review the changed files and identify whether the change is backend or frontend
- Create or update tests that exercise the new behavior
- Use existing test conventions and tools in the repo
- If a test file does not already exist for the feature, add one next to the affected module
- Before returning success, run the applicable tests and report the result

## Examples

- "When adding `/posts/:id/like`, add a backend spec that tests liking and unliking a post."
- "When changing the comment reply UI, add a frontend test for reply selection and submission."
