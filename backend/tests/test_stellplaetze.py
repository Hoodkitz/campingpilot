def test_create_stellplatz(client, auth_headers):
    resp = client.post("/api/stellplaetze/", headers=auth_headers, json={
        "nummer": "A1",
        "typ": "wohnmobil",
        "preis_pro_nacht": 25.0,
        "hat_strom": True,
        "hat_wasser": True
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["nummer"] == "A1"
    assert data["typ"] == "wohnmobil"
    assert data["preis_pro_nacht"] == 25.0


def test_create_stellplatz_duplicate_nummer(client, auth_headers):
    client.post("/api/stellplaetze/", headers=auth_headers, json={
        "nummer": "B1",
        "typ": "zelt",
        "preis_pro_nacht": 10.0
    })
    resp = client.post("/api/stellplaetze/", headers=auth_headers, json={
        "nummer": "B1",
        "typ": "wohnwagen",
        "preis_pro_nacht": 20.0
    })
    assert resp.status_code == 400


def test_list_stellplaetze(client, auth_headers):
    client.post("/api/stellplaetze/", headers=auth_headers, json={
        "nummer": "C1", "typ": "wohnmobil", "preis_pro_nacht": 30.0
    })
    client.post("/api/stellplaetze/", headers=auth_headers, json={
        "nummer": "C2", "typ": "zelt", "preis_pro_nacht": 15.0
    })
    resp = client.get("/api/stellplaetze/", headers=auth_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 2


def test_get_stellplatz(client, auth_headers):
    create_resp = client.post("/api/stellplaetze/", headers=auth_headers, json={
        "nummer": "D1", "typ": "wohnwagen", "preis_pro_nacht": 22.0
    })
    stellplatz_id = create_resp.json()["id"]
    resp = client.get(f"/api/stellplaetze/{stellplatz_id}", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["nummer"] == "D1"


def test_get_stellplatz_not_found(client, auth_headers):
    resp = client.get("/api/stellplaetze/9999", headers=auth_headers)
    assert resp.status_code == 404


def test_update_stellplatz(client, auth_headers):
    create_resp = client.post("/api/stellplaetze/", headers=auth_headers, json={
        "nummer": "E1", "typ": "wohnmobil", "preis_pro_nacht": 20.0
    })
    stellplatz_id = create_resp.json()["id"]
    resp = client.put(f"/api/stellplaetze/{stellplatz_id}", headers=auth_headers, json={
        "preis_pro_nacht": 35.0
    })
    assert resp.status_code == 200
    assert resp.json()["preis_pro_nacht"] == 35.0


def test_delete_stellplatz(client, auth_headers):
    create_resp = client.post("/api/stellplaetze/", headers=auth_headers, json={
        "nummer": "F1", "typ": "zelt", "preis_pro_nacht": 12.0
    })
    stellplatz_id = create_resp.json()["id"]
    resp = client.delete(f"/api/stellplaetze/{stellplatz_id}", headers=auth_headers)
    assert resp.status_code == 204
    resp2 = client.get(f"/api/stellplaetze/{stellplatz_id}", headers=auth_headers)
    assert resp2.status_code == 404


def test_filter_by_typ(client, auth_headers):
    client.post("/api/stellplaetze/", headers=auth_headers, json={
        "nummer": "G1", "typ": "wohnmobil", "preis_pro_nacht": 25.0
    })
    client.post("/api/stellplaetze/", headers=auth_headers, json={
        "nummer": "G2", "typ": "zelt", "preis_pro_nacht": 10.0
    })
    resp = client.get("/api/stellplaetze/?typ=wohnmobil", headers=auth_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 1
    assert resp.json()[0]["typ"] == "wohnmobil"
