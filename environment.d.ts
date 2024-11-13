// Declare environmentfile types for typescript => https://stackoverflow.com/questions/45194598/using-process-env-in-typescript
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      DATABASE_PORT: number | undefined;
    }
  }
}

export {};
