/**
 * •UNI• Stripe Integration v4 (2026 Compatible)
 * Using Secure Stripe Payment Links to bypass 'Client-only' deprecation.
 */

const PAYMENT_LINKS = {
    lifetime: 'https://buy.stripe.com/7sY4gz0iL63J2g6cUb6Na02',         // Standard $25
    lifetime_discount: 'https://buy.stripe.com/fZudR90iL1NtaMC8DV6Na03', // Study Reward $20
    monthly: 'https://buy.stripe.com/5kQcN5c1t3VBaMCbQ76Na04'           // $2.99 / mo
};

/**
 * Redirects the user to a secure Stripe-hosted checkout page.
 * Prefills user information to minimize friction.
 * 
 * @param {string} type - 'lifetime' | 'monthly'
 * @param {string} userEmail - Used to prefill the checkout form
 * @param {boolean} hasDiscount - Whether the user earned the 'Study Reward'
 */
export async function redirectToCheckout(type, userEmail, hasDiscount = false) {
    console.log('[•UNI•] Initializing secure checkout sequence...');

    // Determine target link based on type and discount status
    let baseUrl = PAYMENT_LINKS[type];

    if (type === 'lifetime' && hasDiscount) {
        baseUrl = PAYMENT_LINKS.lifetime_discount;
    }

    if (!baseUrl) {
        console.error('[•UNI•] Fatal: No valid payment link found for type:', type);
        throw new Error('Sanctuary selection unavailable.');
    }

    // Optimize UX: Prefill the user's email so they don't have to re-type it.
    // Also ensures we can match the payment to the correct internal user easily.
    const checkoutUrl = new URL(baseUrl);
    if (userEmail) {
        checkoutUrl.searchParams.set('prefilled_email', userEmail);
    }

    // 'client_reference_id' can be added if needed for webhooks, but for now 
    // the successUrl return flow in Chat.jsx handles the status update.

    console.log('[•UNI•] Redirecting to Stripe...');
    window.location.href = checkoutUrl.toString();
}
