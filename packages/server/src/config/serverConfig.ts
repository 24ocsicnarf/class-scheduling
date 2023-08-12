import path from "path";
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const serverConfig: {
  port: number;
  origin: string;
  dbUri: string;
  secretKey: string;
  cookieSecret: string;
  accessTokenExpiresInSeconds: number;
} = {
  port: process.env.NODE_PORT as unknown as number,
  origin: process.env.ORIGIN as unknown as string,
  dbUri: process.env.DATABASE_URL as unknown as string,
  secretKey: process.env.SECRET_KEY as string,
  cookieSecret: process.env.COOKIE_SECRET as string,
  accessTokenExpiresInSeconds: 24 * 60 * 60,
};

export default serverConfig;
