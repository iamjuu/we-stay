import { MongoClient } from "mongodb";
import { getMongoUri } from "@/lib/server-config";

/** Atlas cluster name (e.g. WestayHome) is part of the connection URI only. */
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME ?? "Westay";

/** Collection for wizard / eligibility / configurator payloads. */
export const USER_DATAS_COLLECTION = "User_Datas";

const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

export async function getMongoClient(): Promise<MongoClient | null> {
  const uri = getMongoUri();
  if (!uri) return null;
  if (!globalForMongo._mongoClient) {
    globalForMongo._mongoClient = new MongoClient(uri);
    await globalForMongo._mongoClient.connect();
  }
  return globalForMongo._mongoClient;
}

export async function getUserDatasCollection() {
  const client = await getMongoClient();
  if (!client) return null;
  return client.db(MONGO_DB_NAME).collection(USER_DATAS_COLLECTION);
}
