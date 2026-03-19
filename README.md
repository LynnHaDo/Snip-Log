This is the frontend app for SnipLog, a platform for sharing, executing code snippets. AI integration to be added soon.

## Getting Started

First, run the development server:

```bash
nvm use node
npm run dev
```

Whenever a schema needs to be changed, reactivate convex:

```bash
npx convex dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Testing Stripe API locally

1. Install Stripe CLI

```
brew install stripe/stripe-cli/stripe
```

2. Log in 

```
stripe login
```

3. In a separate terminal (from your app dev run), start the webhook forwarder

```
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

4. In your `.env` file, save your webhook secret and Stripe's secret key

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
