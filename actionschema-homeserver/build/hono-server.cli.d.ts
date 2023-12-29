declare const server: {
    fetch: any;
    port: 42000;
    hostname: string;
};
declare global {
    var serverRestartedCount: number | undefined;
}
export default server;
//# sourceMappingURL=hono-server.cli.d.ts.map