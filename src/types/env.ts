export const accessTokenSecret: string  = process.env.ACCESS_TOKEN_SECRET!;
export const accessTokenExpiry: string  = process.env.ACCESS_TOKEN_EXPIRY!;

if(!accessTokenSecret || !accessTokenExpiry) {
    throw new Error("Missing Access Token Secret or missing Access Token Expiry");
}