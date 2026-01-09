"use client";

import { useEffect, useState } from "react";
import { createPublicClient, http, parseAbi } from "viem";
import { base } from "viem/chains";

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

const TALENT_BUILDER_SCORE_ADDRESS = "0xBBFeDA7c4d8d9Df752542b03CdD715F790B32D0B";
const TALENT_BUILDER_SCORE_ABI = parseAbi(["function getScoreByAddress(address wallet) view returns (uint256)"]);

export const useTalentBuilderScore = (address: string) => {
  const [score, setScore] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      setIsLoading(true);
      try {
        const data = await publicClient.readContract({
          address: TALENT_BUILDER_SCORE_ADDRESS,
          abi: TALENT_BUILDER_SCORE_ABI,
          functionName: "getScoreByAddress",
          args: [address],
        });

        setScore(data);
      } catch (error) {
        console.error("Error fetching score:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (address) {
      fetchScore();
    }
  }, [address]);

  return { data: score, isLoading };
};
