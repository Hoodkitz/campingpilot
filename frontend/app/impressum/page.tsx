import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Impressum – Campingpilot",
  robots: { index: false },
};

export default function Page() {
  return (
    <LegalPage title="Impressum">
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        [PLATZHALTER: Firmenname / vollständiger Name]<br />
        [PLATZHALTER: Straße und Hausnummer]<br />
        [PLATZHALTER: PLZ Ort]
      </p>
      <h2>Vertreten durch</h2>
      <p>[PLATZHALTER: Name des Vertretungsberechtigten]</p>
      <h2>Kontakt</h2>
      <p>
        E-Mail: [PLATZHALTER: E-Mail-Adresse]<br />
        Telefon: [PLATZHALTER: Telefonnummer]
      </p>
      <h2>Registereintrag und Umsatzsteuer</h2>
      <p>
        Registergericht / Registernummer: [PLATZHALTER oder entfällt]<br />
        USt-IdNr. gemäß § 27a UStG: [PLATZHALTER oder entfällt]
      </p>
      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>[PLATZHALTER: Name und Anschrift]</p>
      <h2>Hinweis</h2>
      <p>Campingpilot ist eine Verwaltungssoftware für Campingplätze. Verantwortlich für Buchungen, Abrechnung und Meldepflichten bleibt allein der Platzbetreiber. Es wird keine Gewähr für Rechtskonformität (z. B. DSGVO, Meldewesen) übernommen.</p>
    </LegalPage>
  );
}
