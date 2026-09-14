import "dotenv/config";

const getEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const config = {
  nodeEnv: getEnv("NODE_ENV"),
  port: getEnv("PORT"),
  database: {
    url: getEnv("DATABASE_URL"),
  },
  frontend: {
    url: getEnv("FRONTEND_URL"),
  },
  smtp: {
    host: getEnv("SMTP_HOST"),
    port: Number(getEnv("SMTP_PORT")),
    user: getEnv("SMTP_USER"),
    password: getEnv("SMTP_PASSWORD"),
    from: getEnv("SMTP_FROM"),
  },
};
