# Vortexus Backend

Flask backend for:

- JWT login
- website lead capture
- lead management
- dashboard summaries for website-attributed revenue

## Setup

1. Create a virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and update values.
4. Run the server:

```bash
python run.py
```

## Main API endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/leads/public`
- `GET /api/leads`
- `GET /api/leads/<id>`
- `PATCH /api/leads/<id>`
- `GET /api/dashboard/summary`

## Attribution model

Every lead can store:

- source channel
- landing page
- product interest
- service interest
- estimated, quoted, and closed values
- qualification and sales status

This supports reporting for:

- website leads
- qualified leads
- pipeline value
- website-sourced revenue
- revenue by page
- revenue by product


curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Admin User",
    "email":"admin@example.com",
    "password":"StrongPassword123"
  }'
