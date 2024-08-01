import { Aptos, AptosConfig } from '@aptos-labs/ts-sdk';

export const APTOS_COIN_TYPE = '0x1::aptos_coin::AptosCoin';

export const AptosClient = new Aptos(
  new AptosConfig({
    network: import.meta.env.VITE_APP_NETWORK,
  }),
);
