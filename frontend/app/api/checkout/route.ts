import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const PLANS = ['Starter', 'Professional', 'Business'] as const;
const INTERVALS = ['month', 'year'] as const;

function getPriceId(plan: string, interval: string): string | undefined {
  return process.env[`STRIPE_PRICE_${plan.toUpperCase()}_${interval.toUpperCase()}`];
}

function getAllowedPriceIds(): Set<string> {
  return new Set(
    (process.env.STRIPE_ALLOWED_PRICE_IDS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

export async function POST(request: NextRequest) {
  try {
    const { plan, interval } = await request.json();

    if (!(PLANS as readonly string[]).includes(plan) || !(INTERVALS as readonly string[]).includes(interval)) {
      return NextResponse.json({ error: 'Ungültiger Plan oder Intervall' }, { status: 400 });
    }

    const priceId = getPriceId(plan, interval);
    const allowed = getAllowedPriceIds();

    if (!process.env.STRIPE_SECRET_KEY || !priceId || allowed.size === 0) {
      console.error('Stripe nicht konfiguriert: STRIPE_SECRET_KEY, STRIPE_PRICE_<PLAN>_<INTERVAL> und STRIPE_ALLOWED_PRICE_IDS setzen');
      return NextResponse.json({ error: 'Checkout ist nicht konfiguriert' }, { status: 503 });
    }

    if (!allowed.has(priceId)) {
      return NextResponse.json({ error: 'Ungültige priceId' }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
    const origin = request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pricing`,
      metadata: { plan, interval },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Fehler beim Erstellen der Checkout-Session' }, { status: 500 });
  }
}
