'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">⛺</span>
            <span className="text-xl font-bold text-gray-900">Campingpilot</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-primary-600 transition-colors">
              Preise
            </a>
            <a href="#faq" className="text-gray-600 hover:text-primary-600 transition-colors">
              FAQ
            </a>
            <Link
              href="/login"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Anmelden
            </Link>
            <a
              href="#pricing"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Kostenlos starten
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menü öffnen"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              <a href="#features" className="text-gray-600 hover:text-primary-600" onClick={() => setIsOpen(false)}>
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-primary-600" onClick={() => setIsOpen(false)}>
                Preise
              </a>
              <a href="#faq" className="text-gray-600 hover:text-primary-600" onClick={() => setIsOpen(false)}>
                FAQ
              </a>
              <Link href="/login" className="text-gray-600 hover:text-primary-600" onClick={() => setIsOpen(false)}>
                Anmelden
              </Link>
              <a
                href="#pricing"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg text-center font-medium"
                onClick={() => setIsOpen(false)}
              >
                Kostenlos starten
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
