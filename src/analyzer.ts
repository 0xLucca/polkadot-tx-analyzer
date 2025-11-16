import { ApiPromise, WsProvider } from "@polkadot/api";
import { setup, setStorage } from "@acala-network/chopsticks-core";
import { SqliteDatabase } from "@acala-network/chopsticks-db";
import "@polkadot/api-augment";
import { decodeStorageDiff } from "./state-decoder";
import { analyzeWithLLM } from "./llm-analyzer";
import { createSubmittable } from "@polkadot/api/submittable";

interface AnalyzeTxParams {
  extrinsic: `0x${string}`;
  caller: string;
  network: string;
}

export async function analyzeTransaction(params: AnalyzeTxParams) {
  const { extrinsic, caller, network } = params;

  const wsProvider = new WsProvider(network);
  const api = await ApiPromise.create({ provider: wsProvider });
  await api.isReady;
  
  //TODO: Handle both scenarios, if the extrinsic is encoded as extrinsic with prefix or it is a call
  const decodedExtrinsic = api.createType('Call', extrinsic);
  console.log(decodedExtrinsic.toHuman(), "decoded_extrinsic");

  // Get state changes
  try {
    const {outcome, oldState, newState, delta} = await forkAndExecute(network, extrinsic, caller);
    //console.dir(stateChanges, { depth: null });
    const analysis = await analyzeWithLLM(
      JSON.stringify(decodedExtrinsic.toHuman()),
      JSON.stringify(outcome.toHuman()),
      { oldState, newState, delta }
    );

    return {
      analysis,
    };
  } catch (error: any) {
    console.error("Error in analyzeTransaction:", error?.message || error);
    throw error;
  }

}

async function forkAndExecute(network: string, extrinsic: `0x${string}`, caller: string) {
  //TODO: Remove this
  let callerAddress = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";

  const forkedChain = await setup({
    endpoint: network,
    block: null,
    mockSignatureHost: true,
    db: new SqliteDatabase("cache"),
  });

  //TODO: Remove this
  await setStorage(forkedChain, {
    System: {
      Account: [
        [
          ["5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"],
          {
            providers: 1,
            data: {
              free: "1000000000000000000",
            },
          },
        ]
      ],
    },
  })

  const { outcome, storageDiff } = await forkedChain.dryRunExtrinsic({
    call: extrinsic,
    address: callerAddress,
  });

//   if (outcome.isErr) {
//     throw new Error(outcome.asErr.toString());
//   }

  console.log(outcome.toHuman(), "dry_run_outcome");

  const { oldState, newState, delta } = await decodeStorageDiff(
    forkedChain.head,
    storageDiff
  );

  return {outcome, oldState, newState, delta };
}
