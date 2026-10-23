export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            <span className="mr-2">🚀</span>
            Jetzt neu: Stellplatz-Verwaltung in Echtzeit
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Campingplatz-Verwaltung{' '}
            <span className="text-primary-600">leicht gemacht</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Verwalte Stellplätze, Reservierungen und Preise – alles in einer modernen,
            einfachen Lösung. Für Wohnmobilparks und Campingplätze jeder Größe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#pricing"
              className="bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30 hover:-translate-y-0.5"
            >
              Preise ansehen
            </a>
            <a
              href="#features"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-primary-600 hover:text-primary-600 transition-all"
            >
              Features entdecken
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Keine Kreditkarte erforderlich · Jederzeit kündbar
          </p>
        </div>

        {/* Hero Image / Dashboard Preview */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="ml-4 text-sm text-gray-500">Campingpilot Dashboard</span>
            </div>
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-primary-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary-700">127</div>
                  <div className="text-xs text-gray-600">Stellplätze</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-700">89</div>
                  <div className="text-xs text-gray-600">Belegt</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-amber-700">23</div>
                  <div className="text-xs text-gray-600">Anstehend</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-700">4.840€</div>
                  <div className="text-xs text-gray-600">Umsatz/Monat</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Belegung heute</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">70% ausgelastet</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Check-ins</div>
                  <div className="text-lg font-bold text-gray-900">12 Gäste</div>
                  <div className="text-xs text-gray-500">heute erwartet</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Nächste Woche</div>
                  <div className="text-lg font-bold text-gray-900">94%</div>
                  <div className="text-xs text-gray-500">gebucht</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
