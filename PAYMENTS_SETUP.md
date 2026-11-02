# SpoteraDeals verified payments and refund points

## Behavior

- New reservations are pending/unpaid, with no voucher code, until server verification.
- Stripe-hosted Checkout uses the published server price in AED. Browser prices and paid flags are ignored.
- Both signed webhook fulfillment and authenticated post-checkout reconciliation use the same atomic, idempotent confirmation operation.
- Legacy pay-at-venue passes are no longer redeemable. They are not charged or credited automatically.
- Customer or administrator can cancel unused bookings. Eligible verified amounts are credited once as **refund points**, not a Stripe/card refund. Unpaid cancellations receive no points.
- Refund credit is separate from loyalty/promotional points. **100 points = AED 1**, with no automatic expiry in this implementation. Customers with sufficient server-stored credit can pay in full with points; partial points/card payments are not supported.
- The policy is disclosed in EN/AR/FR/RU before checkout, accepted explicitly, and stored with version/time. Cash refunds legally required and card disputes are not overridden by the policy; contact support for these exceptions.
- No real customer data is migrated or deleted by this release. Existing unpaid reservations require support review, not automatic conversion to paid bookings.

## Required production setup

Confirmed receiving account: **Nextwave blogging services**, `acct_1TOui83YTRMQpiD2`.

Store these as **Production Secret** environment variables in the existing Vercel `spotera-deals` project. Never paste keys into chat or commit them:

- `STRIPE_RESTRICTED_KEY`: an account-specific restricted key with minimum permissions for reading own account and creating/retrieving Checkout Sessions, including inline price/product creation as required. Do not grant payouts or bank-account changes.
- `STRIPE_WEBHOOK_SECRET`: signing secret for `https://www.spoteradeals.com/api/payments/webhook`.
- `STRIPE_PAYMENTS_ENABLED`: `true` only after sandbox and endpoint verification. Leave unset until ready.

Webhook events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`.

Stripe connection in ChatGPT does **not** give the deployed website a reusable API credential. The account owner must securely provision the restricted key in Vercel. No client-side/publishable key is needed for hosted Checkout.

Redeploy after environment changes. `/api/health` reports `paymentsConfigured` without exposing secrets. It only reports the presence of configuration, not successful account verification. Starting checkout also checks the key's own account and `charges_enabled` before creating a session.

## Verification before activation

Run `npm test`, `npm run lint`, `npm run build:web`. Use Stripe's sandbox (never real card charges) to verify successful, declined, abandoned, asynchronous, tampered-amount and duplicate-event cases. Configure an isolated sandbox account/store; the production code account check must remain pinned to the selected live account. Verify webhook raw-body signatures in deployment and the payment-return flow on a real phone. Mock/unit tests alone do not establish live payment readiness.

For legal or card-network cash-refund exceptions and disputes, support must reconcile any already-issued/spent refund credit before issuing a card refund, to avoid double compensation. Automated Stripe cash refunds, chargeback balance adjustments, partner payouts, tax registrations, and receipt email delivery are not implemented by this change.

Until configuration is complete, checkout fails closed with a clear message; no unpaid confirmation or QR is issued.
