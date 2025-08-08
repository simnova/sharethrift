// Environment variables type declarations
declare namespace NodeJS {
  interface ProcessEnv {
    TWILIO_ACCOUNT_SID?: string;
    TWILIO_AUTH_TOKEN?: string;
    TWILIO_CONVERSATIONS_SERVICE_SID?: string;
  }
}