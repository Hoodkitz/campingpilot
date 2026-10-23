'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const plans = [
  {
    name: 'Starter',
    description: 'Für kleine Campingplätze und Einzelunternehmer',
    priceMonthly: 19,
    priceYearly: 15,
    features: [
      'Bis zu 50 Stellplätze',
      'Reservierungsverwaltung',
      'E-Mail-Benachrichtigungen',
      'Basis-Statistiken',
      '1 Benutzer',
    ],
    cta: 'Plan wählen',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'Für mittelgroße Campingplätze mit Wachstum',
    priceMonthly: 39,
    priceYearly: 31,
    features: [
      'Bis zu 200 Stellplätze',
      'Alle Starter-Features',
      'Online-Buchung & Zahlungen',
      'Erweiterte Statistiken',
      'Saisonpreise & Rabatte',
      '5 Benutzer',
      'Prioritäts-Support',
    ],
    cta: 'Plan wählen',
    popular: true,
  },
  {
    name: 'Business',
    description: 'Für große Campingparks und Ketten',
    priceMonthly: 49,
    priceYearly: 39,
    features: [
      'Unbegrenzte Stellplätze',
      'Alle Professional-Features',
      'API-Zugang',
      'Mehrere Standorte',
      'Unbegrenzte Benutzer',
      'Persönlicher Support',
      'White-Label-Option',
    ],
    cta: 'Kontakt aufnehmen',
    popular: false,
  },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  const handleCheckout = async (planName: string) => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planName, interval: isYearly ? 'year' : 'month' }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Fehler beim Erstellen der Checkout-Session. Bitte versuche es später erneut.');
      }
    } catch {
      alert('Fehler beim Erstellen der Checkout-Session. Bitte versuche es später erneut.');
    }
  };

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Einfache, transparente Preise
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Wähle den Plan, der zu deinem Campingplatz passt. Alle Pläne mit monatlicher oder jährlicher Abrechnung.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Monatlich
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isYearly ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              aria-label="Abrechnungszeitraum wechseln"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Jährlich
              <span className="ml-1 text-xs text-primary-600 font-semibold">20% sparen</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-8 ${
                plan.popular
                  ? 'ring-2 ring-primary-600 shadow-xl scale-105'
                  : 'border border-gray-200 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  BELIEBT
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {isYearly ? plan.priceYearly : plan.priceMonthly}€
                  </span>
                  <span className="text-gray-500 ml-1">/Monat</span>
                </div>
                {isYearly && (
                  <p className="text-sm text-primary-600 mt-1">
                    Jährlich abgerechnet ({plan.priceYearly * 12}€/Jahr)
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-700">
                    <svg className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.name)}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/25'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Preise und Kündigung gemäß AGB
        </p>
      </div>
    </section>
  );
}
