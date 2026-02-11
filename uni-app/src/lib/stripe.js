import { loadStripe } from '@stripe/stripe-js';

// YOUR ACTION: Replace this with your actual Stripe Publishable Key from the dashboard
const STRIPE_PUBLIC_KEY = 'pk_live_51Rkc9jEEe6fVBpFcgw08JASKpgOC7EwUWbgnlUW344iCbr2EOucu0gusOQ3qrujR1kzVmoAItjVoqaM10wxiNMgd00Scaj4wUm';

// YOUR ACTION: Replace these with your actual Price IDs from Stripe Dashboard
const PRICE_IDS = {
    lifetime: 'price_1SzXqVEEe6fVBpFcUaCBSRIL',
    monthly: 'price_1SzXsuEEe6fVBpFckwUpRs2b'
};

export async function redirectToCheckout(type, userEmail) {
    const stripe = await loadStripe(STRIPE_PUBLIC_KEY);

    // Stripe Checkout handles the payment and redirects back to UNI
    const { error } = await stripe.redirectToCheckout({
        lineItems: [{
            price: PRICE_IDS[type],
            quantity: 1,
        }],
        mode: type === 'lifetime' ? 'payment' : 'subscription',
        successUrl: `${window.location.origin}?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}`,
        customerEmail: userEmail,
    });

    if (error) {
        console.error('[•UNI•] Stripe Error:', error);
        throw error;
    }
}
