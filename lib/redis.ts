import { createClient } from "redis";

export const getRedisClient = async () => {
  const client = createClient();
  try {
    await client.connect();
  } catch (err) {
    throw new Error("Failed to connect to Redis");
  }

  return client;
};
