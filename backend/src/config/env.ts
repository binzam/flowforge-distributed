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
  rabbitmqUrl: getEnv("RABBITMQ_URL"),
  database: {
    url: getEnv("DATABASE_URL"),
  },
  frontend: {
    url: getEnv("FRONTEND_URL"),
  },
};
