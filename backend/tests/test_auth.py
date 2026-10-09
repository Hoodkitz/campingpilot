def test_register_success(client):
    resp = client.post("/api/auth/register", json={
        "username": "newuser",
        "email": "new@example.com",
        "password": "pass123"
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["username"] == "newuser"
    assert data["email"] == "new@example.com"
    assert "id" in data


def test_register_duplicate_username(client):
    client.post("/api/auth/register", json={
        "username": "dupuser",
        "email": "dup1@example.com",
        "password": "pass123"
    })
    resp = client.post("/api/auth/register", json={
        "username": "dupuser",
        "email": "dup2@example.com",
        "password": "pass123"
    })
    assert resp.status_code == 400


def test_register_duplicate_email(client):
    client.post("/api/auth/register", json={
        "username": "user1",
        "email": "same@example.com",
        "password": "pass123"
    })
    resp = client.post("/api/auth/register", json={
        "username": "user2",
        "email": "same@example.com",
        "password": "pass123"
    })
    assert resp.status_code == 400


def test_login_success(client):
    client.post("/api/auth/register", json={
        "username": "loginuser",
        "email": "login@example.com",
        "password": "mypass"
    })
    resp = client.post("/api/auth/token", data={
        "username": "loginuser",
        "password": "mypass"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client):
    client.post("/api/auth/register", json={
        "username": "wrongpass",
        "email": "wrong@example.com",
        "password": "correct"
    })
    resp = client.post("/api/auth/token", data={
        "username": "wrongpass",
        "password": "incorrect"
    })
    assert resp.status_code == 401


def test_get_me(client, auth_headers):
    resp = client.get("/api/auth/me", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["username"] == "testuser"


def test_get_me_no_token(client):
    resp = client.get("/api/auth/me")
    assert resp.status_code == 401
