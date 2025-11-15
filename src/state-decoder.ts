import { Block, decodeBlockStorageDiff } from "@acala-network/chopsticks-core";
import _ from "lodash";
import { HexString } from "@polkadot/util/types";

export type StorageDiffResult = {
  oldState: object;
  newState: object;
  delta: object | null; //TODO: Use library to calculate diff
};

export const decodeStorageDiff = async (
  block: Block,
  diff: [HexString, HexString | null][]
): Promise<StorageDiffResult> => {
  const [oldState, newState] = await decodeBlockStorageDiff(block, diff);
  const oldStateWithoutEvents: any = _.cloneDeep(oldState);
  if (oldStateWithoutEvents["system"]?.["events"]) {
    oldStateWithoutEvents["system"]["events"] = [];
  }
  return {
    oldState,
    newState,
    delta: null, //TODO: Use library to calculate diff
  };
};
