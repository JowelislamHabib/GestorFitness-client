import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const PLAN_PRICE_ID= {
    'seeker_free': 'price_1TgTc1HqmL4wYioGigRVDGBz',
    'seeker_pro': 'price_1TgU85HqmL4wYioGxK3cmzUF',
    'seeker_premium': 'price_1TgU98HqmL4wYioGf9yNtw2Y',
    'seeker_enterprise': 'price_1TgUEUHqmL4wYioG7etOoA0J',
    'recruiter_free': 'price_1TgUOWHqmL4wYioGjYC9FDgc',
    'recruiter_growth': 'price_1TgUO2HqmL4wYioGOHcvT5KZ',
    'recruiter_pro': 'price_1TgUPJHqmL4wYioG8szPOtJe',
    'recruiter_enterprise': 'price_1TgUPqHqmL4wYioGh163Fh8i',

} 