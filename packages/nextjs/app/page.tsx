import Link from "next/link";
import type { NextPage } from "next";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Builder = {
  id: string;
  address: string;
  checkInCount: number;
  firstCheckIn: number;
  lastCheckIn: number;
};

const SUBGRAPH_URL = "https://api.studio.thegraph.com/query/1722630/batch-23-buidlguidl/version/latest";

const GET_BUILDERS_QUERY = `
  query GetBuilders {
    builders(orderBy: lastCheckIn, orderDirection: desc) {
      id
      address
      checkInCount
      firstCheckIn
      lastCheckIn
    }
  }
`;

const build_checkins_query = (builderAddress: string) => {
  return `{
    builder(id: ${builderAddress}) {
      address
      checkInCount
      firstCheckIn
      lastCheckIn
      checkIns {
        checkInContract
        transactionHash
      }
    }
  }`;
};

async function getBuilders(): Promise<any[]> {
  const res = await fetch(SUBGRAPH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_BUILDERS_QUERY,
    }),
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!res.ok) {
    // throw new Error(`Failed to fetch builders: ${res.statusText}`);
    return [];
  }

  const { data } = await res.json();
  const builders: Builder[] = data?.builders || [];
  const buildersPromises = builders.map(builder => {
    return getCheckinsPerBuilder(builder.address);
  });

  const checkIns: any[] = await Promise.all(buildersPromises);
  console.log("checkins", checkIns);
  return checkIns;
}

async function getCheckinsPerBuilder(builderAddress: string): Promise<any[]> {
  const res = await fetch(SUBGRAPH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: build_checkins_query(builderAddress),
    }),
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });
  console.log("checkins res", res);

  if (!res.ok) {
    // throw new Error(`Failed to fetch builders: ${res.statusText}`);
    return [];
  }

  const { data } = await res.json();
  console.log("checkins data", data);
  return data || [];
}

const Home: NextPage = async () => {
  const builders: Builder[] = await getBuilders();

  return (
    <>
      <div className="absolute r-0 l-0 b-0 t-0 break-words bg-black">
        {builders.map(builder => {
          return String(builder);
        })}
      </div>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Batch 23</span>
          </h1>
          <p className="text-center text-lg">Get started by taking a look at your batch GitHub repository.</p>
          <p className="text-lg flex gap-2 justify-center">
            <span className="font-bold">Checked in builders count:</span>
            <span>To Be Implemented</span>
          </p>
        </div>

        <div className="grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col md:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
