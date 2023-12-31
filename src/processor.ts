import { assertNotNull } from "@subsquid/util-internal";
import {
  BlockHeader,
  DataHandlerContext,
  SubstrateBatchProcessor,
  SubstrateBatchProcessorFields,
  Event as _Event,
  Call as _Call,
  Extrinsic as _Extrinsic,
} from "@subsquid/substrate-processor";

import { events } from "./types";

export const processor = new SubstrateBatchProcessor()
  .setDataSource({
    // Chain RPC endpoint is required on Substrate for metadata and real-time updates
    chain: {
      // Set via .env for local runs or via secrets when deploying to Subsquid Cloud
      // https://docs.subsquid.io/deploy-squid/env-variables/
      url: assertNotNull(process.env.RPC_ROCOCO_WS),
      // More RPC connection options at https://docs.subsquid.io/substrate-indexing/setup/general/#set-data-source
      rateLimit: 10,
    },
  })
  .setBlockRange({ from: Number(process.env.BLOCK_START) || 0 })
  .addEvent({
    name: [events.balances.transfer.name],
    extrinsic: true,
  })
  .setFields({
    event: {
      args: true,
    },
    extrinsic: {
      hash: true,
      fee: true,
    },
    block: {
      timestamp: true,
    },
  });

export type Fields = SubstrateBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Event = _Event<Fields>;
export type Call = _Call<Fields>;
export type Extrinsic = _Extrinsic<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
