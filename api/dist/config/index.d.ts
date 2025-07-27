interface DatabaseConfig {
    uri: string;
    options: {
        maxPoolSize?: number;
        serverSelectionTimeoutMS?: number;
        socketTimeoutMS?: number;
        family?: number;
    };
}
interface JWTConfig {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
}
interface ServerConfig {
    port: number;
    env: string;
    corsOrigin: string;
}
interface RateLimitConfig {
    windowMs: number;
    max: number;
    message: string;
}
interface Config {
    server: ServerConfig;
    database: DatabaseConfig;
    jwt: JWTConfig;
    rateLimit: RateLimitConfig;
}
declare const config: Config;
export default config;
//# sourceMappingURL=index.d.ts.map