# Finance Module

The finance module implements invoice creation/status/update, expense creation/update, and revenue summary using tenant/workspace scoped records.

APIs:

- `POST /api/v1/finance/invoices`
- `PATCH /api/v1/finance/invoices/:id`
- `GET /api/v1/finance/invoices/:id/status`
- `POST /api/v1/finance/expenses`
- `PATCH /api/v1/finance/expenses/:id`
- `GET /api/v1/finance/revenue/summary`
