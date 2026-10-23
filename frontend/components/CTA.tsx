export default function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Bereit, deinen Campingplatz zu digitalisieren?
        </h2>
        <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
          Starte heute mit Campingpilot und verwalte deinen Campingplatz
          effizienter als je zuvor.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#pricing"
            className="bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-50 transition-all shadow-lg"
          >
            Preise ansehen
          </a>
          <a
            href="mailto:info@campingpilot.de"
            className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all"
          >
            Kontakt aufnehmen
          </a>
        </div>
      </div>
    </section>
  );
}
