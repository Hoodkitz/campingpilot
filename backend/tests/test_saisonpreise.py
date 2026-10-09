from datetime import date


def test_create_saisonpreis(client, auth_headers):
    resp = client.post("/api/saisonpreise/", headers=auth_headers, json={
        "name": "Hochsaison 2026",
        "start_datum": "2026-06-01",
        "end_datum": "2026-08-31",
        "preis_pro_nacht": 35.0,
        "stellplatz_typ": "wohnmobil"
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Hochsaison 2026"
    assert data["preis_pro_nacht"] == 35.0


def test_create_saisonpreis_invalid_dates(client, auth_headers):
    resp = client.post("/api/saisonpreise/", headers=auth_headers, json={
        "name": "Ungültig",
        "start_datum": "2026-08-31",
        "end_datum": "2026-06-01",
        "preis_pro_nacht": 30.0,
        "stellplatz_typ": "zelt"
    })
    assert resp.status_code == 400


def test_list_saisonpreise(client, auth_headers):
    client.post("/api/saisonpreise/", headers=auth_headers, json={
        "name": "Saison A",
        "start_datum": "2026-04-01",
        "end_datum": "2026-05-31",
        "preis_pro_nacht": 20.0,
        "stellplatz_typ": "wohnmobil"
    })
    client.post("/api/saisonpreise/", headers=auth_headers, json={
        "name": "Saison B",
        "start_datum": "2026-06-01",
        "end_datum": "2026-08-31",
        "preis_pro_nacht": 30.0,
        "stellplatz_typ": "zelt"
    })
    resp = client.get("/api/saisonpreise/", headers=auth_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 2


def test_update_saisonpreis(client, auth_headers):
    create_resp = client.post("/api/saisonpreise/", headers=auth_headers, json={
        "name": "Update Test",
        "start_datum": "2026-04-01",
        "end_datum": "2026-05-31",
        "preis_pro_nacht": 20.0,
        "stellplatz_typ": "wohnwagen"
    })
    preis_id = create_resp.json()["id"]
    resp = client.put(f"/api/saisonpreise/{preis_id}", headers=auth_headers, json={
        "preis_pro_nacht": 28.0
    })
    assert resp.status_code == 200
    assert resp.json()["preis_pro_nacht"] == 28.0


def test_delete_saisonpreis(client, auth_headers):
    create_resp = client.post("/api/saisonpreise/", headers=auth_headers, json={
        "name": "Delete Test",
        "start_datum": "2026-04-01",
        "end_datum": "2026-05-31",
        "preis_pro_nacht": 20.0,
        "stellplatz_typ": "wohnmobil"
    })
    preis_id = create_resp.json()["id"]
    resp = client.delete(f"/api/saisonpreise/{preis_id}", headers=auth_headers)
    assert resp.status_code == 204
