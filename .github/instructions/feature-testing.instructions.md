# Feature and API Testing

These instructions apply to backend API changes and frontend feature work.

- For any new feature, add tests before marking the change as complete.
- When modifying frontend behavior, add or update component/unit tests in `web/` and run the frontend test suite from `web`.
- When modifying backend API behavior, add or update Jest or Node spec tests in `src/` or `test/`, and run the relevant backend tests.
- If a feature touches both frontend and backend, ensure both sides have updated tests for the changed contract.
- Do not rely on manual testing alone; prefer automated tests and keep all relevant suites passing.
