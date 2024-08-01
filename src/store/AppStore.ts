import { APTOS_COIN_TYPE, AptosClient } from '@/config';
import { HexInput, Network } from '@aptos-labs/ts-sdk';
import { WalletCore } from '@aptos-labs/wallet-adapter-core';
import { breakpointsTailwind } from '@vueuse/core';
import BigNumber from 'bignumber.js';
import numeral from 'numeral';
import { defineStore } from 'pinia';

interface SwapConfig {
  refreshInterval: number;
}

interface AppStore {
  mobileSet: ComputedRef<boolean>;
  walletCore: WalletCore;
  address: Ref<string | undefined>;
  connecting: Ref<boolean>;
  connectModalOpen: Ref<boolean>;
  autoConnect: Ref<boolean>;
  aptPrice: Ref<number>;
  balance: Ref<number>;

  fetchBalance: () => void;
  converToUSDT: (amount: number | string | BigNumber, precision?: number) => string;

  swapConfig: Ref<SwapConfig>;
}

const WALLET_NAME = 'AptosWalletName';

const useAppStore = defineStore('appStore', (): AppStore => {
  const address = ref();
  const autoConnect = ref(false);
  const connecting = ref(false);
  const connectModalOpen = ref(false);
  const walletCore = new WalletCore([], ['Petra', 'Mizu Wallet'], {
    network: Network.TESTNET,
    mizuwallet: {
      manifestURL: 'https://assets.mz.xyz/static/config/mizuwallet-connect-manifest.json',
    },
  });
  const aptPrice = ref(0);
  const balance = ref(0);
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const mobileSet = computed(() => breakpoints.smaller('md').value);

  const swapConfig = ref<SwapConfig>({
    refreshInterval: 8 * 1e3,
  });

  walletCore.on('accountChange', () => {
    address.value = walletCore.account?.address;
  });

  walletCore.on('connect', () => {
    window.localStorage.setItem(WALLET_NAME, walletCore.wallet?.name || '');
    address.value = walletCore.account?.address;
    fetchBalance();
    walletCore.onAccountChange();
    walletCore.onNetworkChange();
  });

  walletCore.on('disconnect', () => {
    address.value = undefined;
  });

  const fetchBalance = () => {
    if (address.value) {
      AptosClient.getAccountCoinAmount({
        accountAddress: address.value as HexInput,
        coinType: APTOS_COIN_TYPE,
      })
        .then((res: any) => {
          balance.value = res;
        })
        .catch(() => {
          balance.value = 0;
        });
    } else {
      balance.value = 0;
    }
  };

  const converToUSDT = (amount: number | string | BigNumber, precision: number = 4) => {
    return numeral(new BigNumber(amount).times(aptPrice.value).toNumber() || 0)
      .format(`0,0.[${new Array(precision).fill(0).join('')}]a`)
      .toUpperCase();
  };

  if (autoConnect) {
    setTimeout(async () => {
      if (window.localStorage.getItem(WALLET_NAME)) {
        try {
          connecting.value = true;
          await walletCore.connect(window.localStorage.getItem(WALLET_NAME) as string);
          address.value = walletCore.account?.address;
        } catch (e: any) {
          console.log(e);
        } finally {
          connecting.value = false;
        }
      } else {
        connecting.value = false;
      }
    });
  }

  return {
    mobileSet,
    aptPrice,
    autoConnect,
    connecting,
    connectModalOpen,
    address,
    walletCore,
    balance,

    swapConfig,

    fetchBalance,
    converToUSDT,
  };
});

export default useAppStore;

