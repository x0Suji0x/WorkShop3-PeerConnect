# Frontend repository contracts

Pages should access student data through `StudentRepository`, rather than importing a data source directly. The current implementation is intentionally in-memory and seeded by `studentMockData.ts`; it does not persist through a browser reload.

When a backend is selected, replace `MockStudentRepository` with an API-backed implementation that honours the same `getById` and `update` contract. This keeps the dashboard, profile, and verification UI independent from a specific backend provider.
