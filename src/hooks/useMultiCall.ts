
import { QueryKey, useQuery } from "@tanstack/react-query";
import { ABIContract } from "@vechain/sdk-core";
import { ContractCallResult, ContractClause } from "@vechain/sdk-network";
import { useMemo } from "react";
import { Interface } from "ethers";
import { parseAbi } from "../utils/parseABI";
import { useThor } from "@vechain/vechain-kit";

export interface MultiCallClause {
    contractAddress: string;
    contractInterface: string | readonly any[] | Interface;
    method: string;
    args?: unknown[];
    comment?: string;
}

export interface UseMultiCallParams<TResponse = any> {
    clauses: MultiCallClause[];
    queryKey: QueryKey;
    enabled?: boolean;
    mapResponse?: (responses: any[]) => TResponse;
    staleTime?: number;
    revision?: number | string;
}

export function useMultiCall<TResponse = any>({ clauses, queryKey, enabled = true, mapResponse, staleTime = 60 * 1000, revision }: UseMultiCallParams<TResponse>) {
    const thorClient = useThor();

    const contractClauses = useMemo(() => {
        if (!thorClient || !clauses?.length) return [] as ContractClause[];

        return clauses
            .map((clause, index) => {
                if (!clause?.contractAddress || !clause?.method) {
                    console.log(`Skipping invalid clause ${index}: missing address or method`);
                    return null;
                }

                try {
                    const abi = parseAbi(clause.contractInterface);
                    const abiContract = ABIContract.ofAbi(abi);
                    const functionAbi = abiContract.getFunction(clause.method);
                    const validatedArgs = clause.args?.map((arg) => (typeof arg === "string" && arg === "" ? "0x0000000000000000000000000000000000000000" : arg)) || [];

                    return {
                        functionAbi,
                        clause: {
                            to: clause.contractAddress,
                            data: functionAbi.encodeData(validatedArgs).toString(),
                            value: "0",
                            comment: clause.comment,
                        },
                    } as ContractClause;
                } catch (error) {
                    return null;
                }
            })
            .filter((clause): clause is ContractClause => clause !== null);
    }, [thorClient, clauses]);

    const enableQuery = useMemo(() => Boolean(thorClient && enabled && clauses?.length), [thorClient, enabled, clauses?.length]);

    return useQuery({
        queryFn: async () => {
            if (!thorClient || !contractClauses?.length) return null as TResponse;

            try {
                const callOptions = revision ? { revision: revision.toString() } : undefined;
                const responses = await thorClient.contracts.executeMultipleClausesCall(contractClauses as any, callOptions);
                const anyFailed = responses.filter((response: ContractCallResult) => !response.success);
                if (anyFailed.length > 0) {
                    throw new Error(`${anyFailed.map((response) => response.result.errorMessage).join(", ")}`);
                }

                const decodedResponses = responses.map((response: ContractCallResult) => response.result.array);
                if (!mapResponse) {
                    return decodedResponses as TResponse;
                }

                try {
                    const mappedResponse = mapResponse(decodedResponses);
                    if (mappedResponse === null || mappedResponse === undefined) {
                        throw new Error("Mapping failed of responses");
                    }

                    return mappedResponse;
                } catch (error) {
                    throw error;
                }
            } catch (error) {
                throw error;
            }
        },
        queryKey,
        enabled: enableQuery,
        staleTime,
    });
}