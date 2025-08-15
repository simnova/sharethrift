import fs from 'node:fs';
import dotenv from 'dotenv';

export const setupEnvironment = () => {
    const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env.sample';
    console.log(`Loading environment variables from ${envPath}`);
    dotenv.config({ path: envPath, override: true });
    console.log('Environment variables set up');
}