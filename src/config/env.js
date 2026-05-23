import "dotenv/config";
export const ENV={
    PORT:process.env.PORT ||5001 ,
    DATABASE_URL:process.env.DATABASE_URL ,
    NODE_ENV:process.env.NODE_ENV ,
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY:process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
};