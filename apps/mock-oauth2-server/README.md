# @apps/mock-oauth2-server

Local OAuth2/OIDC mock server for dev/testing.

## Usage

This package is intended for internal use as a mock OAuth2/OIDC server for development and testing purposes.

## Setup

- Build: `npm run build`
- Clean: `npm run clean`
- Start: `npm start`

## Environment Variables

The following environment variables can be set via `.env` or `.env.local`:

- `PORT` - Port to run the server on (default: 4000)
- `EMAIL` - Email for user portal (default: '')
- `GIVEN_NAME` - Given name for user portal (default: '')
- `FAMILY_NAME` - Family name for user portal (default: '')
- `ADMIN_EMAIL` - Email for admin portal (default: '')
- `ADMIN_GIVEN_NAME` - Given name for admin portal (default: '')
- `ADMIN_FAMILY_NAME` - Family name for admin portal (default: '')

## Exports

The main entry point is `src/index.ts` which handles environment setup and starts the mock OAuth2 server.
