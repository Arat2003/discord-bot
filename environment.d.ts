declare namespace NodeJS {
  export interface ProcessEnv {
    DEV_TOKEN: string;
    PROD_TOKEN: string;
    API_KEY: string;
    DB_URI: string;
    SLOTH_KEY: string;
  }
}
