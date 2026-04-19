import dns from "node:dns/promises";

export const configureDNS = () => {
    dns.setServers(["1.1.1.1"]);
};
