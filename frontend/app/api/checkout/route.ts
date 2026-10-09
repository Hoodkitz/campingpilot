import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Price IDs for Stripe Test Mode
const PRICE_IDS: Record<string, Record<string, string>> = {
  Starter: {
    month: 'price_1PStarterMonth', // Replace with actual Stripe Price ID
    year: 'price_1PStarterYear',   // Replace with actual Stripe Price ID
  },
  Professional: {
    month: 'price_1PProMonth',     // Replace with actual Stripe Price ID
    year: 'price_1PProYear',       // Replace with actual Stripe Price ID
  },
  Business: {
    month: 'price_1PBusinessMonth', // Replace with actual Stripe Price ID
    year: 'price_1PBusinessYear',   // Replace with actual Stripe Price ID
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, interval } = body;

    if (!plan || !interval) {
      return NextResponse.json(
        { error: 'Plan und Intervall sind erforderlich' },
        { status: 400 }
      );
    }

    const priceId = PRICE_IDS[plan]?.[interval];

    if (!priceId) {
      return NextResponse.json(
        { error: 'Ungültiger Plan oder Intervall' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pricing`,
      metadata: {
        plan,
        interval,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Checkout-Session' },
      { status: 500 }
    );
  }
}
