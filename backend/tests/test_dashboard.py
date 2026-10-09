from datetime import datetime, timedelta


def test_dashboard_empty(client, auth_headers):
    resp = client.get("/api/dashboard/", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["gesamt_stellplaetze"] == 0
    assert data["belegte_stellplaetze"] == 0
    assert data["freie_stellplaetze"] == 0


def test_dashboard_with_data(client, auth_headers):
    # Create stellplaetze
    client.post("/api/stellplaetze/", headers=auth_headers, json={
        "nummer": "I1", "typ": "wohnmobil", "preis_pro_nacht": 25.0
    })
    client.post("/api/stellplaetze/", headers=auth_headers, json={
        "nummer": "I2", "typ": "zelt", "preis_pro_nacht": 10.0
    })
    client.post("/api/stellplaetze/", headers=auth_headers, json={
        "nummer": "I3", "typ": "wohnwagen", "preis_pro_nacht": 20.0
    })

    # Create buchung
    stellplatz = client.post("/api/stellplaetze/", headers=auth_headers, json={
        "nummer": "I4", "typ": "wohnmobil", "preis_pro_nacht": 25.0
    }).json()
    check_in = datetime.now() + timedelta(days=1)
    client.post("/api/buchungen/", headers=auth_headers, json={
        "stellplatz_id": stellplatz["id"],
        "gast_name": "Dashboard Test",
        "check_in": check_in.isoformat(),
        "check_out": (check_in + timedelta(days=2)).isoformat()
    })

    resp = client.get("/api/dashboard/", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["gesamt_stellplaetze"] == 4
    assert data["aktive_buchungen"] == 1
    assert data["stellplaetze_nach_typ"]["wohnmobil"] == 2
    assert data["stellplaetze_nach_typ"]["zelt"] == 1
    assert data["buchungen_nach_status"]["reserviert"] == 1
