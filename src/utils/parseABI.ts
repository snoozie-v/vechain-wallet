import { Interface } from "ethers";

export function parseAbi(contractInterface: string | readonly any[] | Interface): any[] {
    try {
        if (contractInterface instanceof Interface) {
            return JSON.parse(contractInterface.formatJson());
        }
        if (Array.isArray(contractInterface)) {
            return contractInterface;
        }
        if (typeof contractInterface === "string") {
            return JSON.parse(contractInterface);
        }
        throw new Error("Invalid ABI format");
    } catch (error) {
        console.error("Error parsing ABI:", error);
        throw error;
    }
}