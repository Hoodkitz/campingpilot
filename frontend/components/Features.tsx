const features = [
  {
    icon: '🏕️',
    title: 'Campingplatz-Verwaltung',
    description:
      'Verwalte deinen kompletten Campingplatz mit allen Stellplätzen, Ausstattungen und Ausstattungsdetails. Intuitive Kartenansicht für schnelle Übersicht.',
    highlights: ['Stellplatz-Karten', 'Ausstattungs-Verwaltung', 'Mehrere Bereiche'],
  },
  {
    icon: '📅',
    title: 'Reservierungen',
    description:
      'Automatisierte Reservierungsverwaltung mit Echtzeit-Verfügbarkeit. Gäste können online buchen, du behältst immer den Überblick.',
    highlights: ['Online-Buchung', 'Echtzeit-Kalender', 'Automatische Bestätigung'],
  },
  {
    icon: '🚐',
    title: 'Stellplätze',
    description:
      'Verwalte verschiedene Stellplatz-Typen: Stellplätze für Wohnmobile, Zelte, Wohnwagen und Dauerstellplätze mit individuellen Preisen.',
    highlights: ['Verschiedene Typen', 'Belegungsplan', 'Dauerstellplätze'],
  },
  {
    icon: '💰',
    title: 'Preise & Saisonpreise',
    description:
      'Flexible Preisgestaltung mit Saisonpreisen, Frühbucher-Rabatten und Last-Minute-Angeboten. Automatische Berechnung der Gesamtsumme.',
    highlights: ['Saisonpreise', 'Rabatt-System', 'Automatische Berechnung'],
  },
  {
    icon: '📊',
    title: 'Statistiken & Auswertungen',
    description:
      'Detaillierte Auswertungen zu Auslastung, Umsatz und Gäste-Statistiken. Exportiere Daten für deine Buchhaltung.',
    highlights: ['Auslastungs-Report', 'Umsatz-Statistik', 'CSV-Export'],
  },
  {
    icon: '🔔',
    title: 'Benachrichtigungen',
    description:
      'Automatische E-Mail-Benachrichtigungen für neue Reservierungen, Check-ins und Check-outs. Nie wieder eine Buchung verpassen.',
    highlights: ['E-Mail-Alerts', 'Check-in Erinnerung', 'Täglicher Report'],
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Alles was du brauchst für deinen Campingplatz
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Campingpilot vereint alle wichtigen Funktionen für die Verwaltung
            deines Campingplatzes in einer modernen, einfachen Lösung.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
              <ul className="space-y-2">
                {feature.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-primary-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
