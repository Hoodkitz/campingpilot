from datetime import datetime, timedelta


def test_create_buchung(client, auth_headers):
    stellplatz = client.post("/api/stellplaetze/", headers=auth_headers, json={
        "nummer": "H1", "typ": "wohnmobil", "preis_pro_nacht": 25.0
    }).json()
    check_in = datetime.now() + timedelta(days=1)
    check_out = check_in + timedelta(days=3)
    resp = client.post("/api/buchungen/", headers=auth_headers, json={
        "stellplatz_id": stellplatz["id"],
        "gast_name": "Max Mustermann",
        "gast_email": "max@example.com",
        "check_in": check_in.isoformat(),
        "check_out": check_out.isoformat()
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["gast_name"] == "Max Mustermann"
    assert data["status"] == "reserviert"
    assert data["gesamtpreis"] == 75.0


def test_create_buchung_invalid_dates(client, auth_headers):
    stellplatz = client.post("/api/stellplaetze/", headers=auth_headers, json={
        "nummer": "H2", "typ": "wohnmobil", "preis_pro_nacht": 25.0
    }).json()
    check_in = datetime.now() + timedelta(days=5)
    check_out = check_in - timedelta(days=1)
    resp = client.post("/api/buchungen/", headers=auth_headers, json={
        "stellplatz_id": stellplatz["id"],
        "gast_name": "Test",
        "check_in": check_in.isoformat(),
        "check_out": check_out.isoformat()
    })
    assert resp.status_code == 400


def test_create_buchung_overlap(client, auth_headers):
    stellplatz = client.post("/api/stellplaetze/", headers=auth_headers, json={
        "nummer": "H3", "typ": "wohnmobil", "preis_pro_nacht": 25.0
    }).json()
    base = datetime.now() + timedelta(days=10)
    client.post("/api/buchungen/", headers=auth_headers, json={
        "stellplatz_id": stellplatz["id"],
        "gast_name": "Erster Gast",
        "check_in": base.isoformat(),
        "check_out": (base + timedelta(days=3)).isoformat()
    })
    resp = client.post("/api/buchungen/", headers=auth_headers, json={
        "stellplatz_id": stellplatz["id"],
        "gast_name": "Zweiter Gast",
        "check_in": (base + timedelta(days=2)).isoformat(),
        "check_out": (base + timedelta(days=5)).isoformat()
    })
    assert resp.status_code == 400


def test_checkin_checkout_flow(client, auth_headers):
    stellplatz = client.post("/api/stellplaetze/", headers=auth_headers, json={
        "nummer": "H4", "typ": "wohnmobil", "preis_pro_nacht": 25.0,
        "hat_strom": True, "hat_wasser": True
    }).json()
    check_in = datetime.now() + timedelta(days=1)
    check_out = check_in + timedelta(days=2)
    buchung = client.post("/api/buchungen/", headers=auth_headers, json={
        "stellplatz_id": stellplatz["id"],
        "gast_name": "Flow Test",
        "check_in": check_in.isoformat(),
        "check_out": check_out.isoformat()
    }).json()

    # Check-in
    resp = client.post(f"/api/buchungen/{buchung['id']}/checkin", headers=auth_headers, json={
        "strom_zaehler_start": 100.0,
        "wasser_zaehler_start": 50.0
    })
    assert resp.status_code == 200
    assert resp.json()["status"] == "checked_in"
    assert resp.json()["strom_zaehler_start"] == 100.0

    # Check-out
    resp = client.post(f"/api/buchungen/{buchung['id']}/checkout", headers=auth_headers, json={
        "strom_zaehler_ende": 115.0,
        "wasser_zaehler_ende": 55.0
    })
    assert resp.status_code == 200
    assert resp.json()["status"] == "checked_out"
    assert resp.json()["strom_zaehler_ende"] == 115.0


def test_stornieren(client, auth_headers):
    stellplatz = client.post("/api/stellplaetze/", headers=auth_headers, json={
        "nummer": "H5", "typ": "zelt", "preis_pro_nacht": 10.0
    }).json()
    check_in = datetime.now() + timedelta(days=1)
    buchung = client.post("/api/buchungen/", headers=auth_headers, json={
        "stellplatz_id": stellplatz["id"],
        "gast_name": "Storno Test",
        "check_in": check_in.isoformat(),
        "check_out": (check_in + timedelta(days=2)).isoformat()
    }).json()
    resp = client.post(f"/api/buchungen/{buchung['id']}/stornieren", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["status"] == "storniert"


def test_list_buchungen(client, auth_headers):
    stellplatz = client.post("/api/stellplaetze/", headers=auth_headers, json={
        "nummer": "H6", "typ": "wohnwagen", "preis_pro_nacht": 20.0
    }).json()
    check_in = datetime.now() + timedelta(days=1)
    client.post("/api/buchungen/", headers=auth_headers, json={
        "stellplatz_id": stellplatz["id"],
        "gast_name": "List Test 1",
        "check_in": check_in.isoformat(),
        "check_out": (check_in + timedelta(days=2)).isoformat()
    })
    client.post("/api/buchungen/", headers=auth_headers, json={
        "stellplatz_id": stellplatz["id"],
        "gast_name": "List Test 2",
        "check_in": (check_in + timedelta(days=5)).isoformat(),
        "check_out": (check_in + timedelta(days=7)).isoformat()
    })
    resp = client.get("/api/buchungen/", headers=auth_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 2
