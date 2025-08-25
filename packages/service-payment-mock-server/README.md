# Payment Mock Server

A simple Express-based mock server for payment API testing.

## Usage

### Install dependencies

```sh
npm install
```

### Start the server (development)

```sh
npm run dev
```

### Build and run (production)

```sh
npm run build
node dist/index.js
```

## Endpoints

- `GET /` — Health check
- `POST /pay` — Mock payment endpoint

