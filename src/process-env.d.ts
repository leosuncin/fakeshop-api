declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly MONGO_URL: string;
    readonly PORT: string;
  }
}
