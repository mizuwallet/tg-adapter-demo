<template>
  <div class="py-10 flex-col-axis-center gap-8"></div>

  <span class="flex-center" v-if="appStore.connecting">Loading...</span>

  <div class="p-5 rounded-4 bg-white mx-4 text-black flex-col" v-if="!appStore.address">
    <div
      class="flex items-center gap-2 font-bold cursor-pointer hover:bg-black/3 px-3 py-2 rounded-2"
      v-for="(wallet, index) in appStore.walletCore.standardWallets"
      :key="index"
      @click="connectWallet(wallet as any)"
    >
      <img :src="wallet.icon" class="w-8 h-8 rounded-full" />
      {{ wallet.name }}
    </div>
  </div>
  <div class="flex-col items-center gap-4" v-else>
    <span class="font-bold">{{ ShortAddress(appStore.address) }}</span>
    <span class="font-bold" v-if="appStore.publicKey">{{ ShortAddress(appStore.publicKey) }}</span>
    <div class="flex-col-center gap-2 mt-10">
      <Button class="!w-fit" @click="signAndSubmitHandler" :loading="submitting">
        SignAndSubmitTransaction
      </Button>
      <Button class="!w-fit" @click="signTransactionHandler" :loading="submitting">
        Sign Transaction
      </Button>
      <Button class="!w-fit" @click="signMessageHandler" :loading="submitting">Sign Message</Button>
      <Button class="!w-fit" @click="disconnect">Disconnect</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { snackbarError, snackbarSuccess } from '@/components/Snackbar';
  import { AptosClient } from '@/config';
  import useWallets from '@/hooks/useWallets';
  import Button from '@/lib/Button.vue';
  import useAppStore from '@/store/AppStore';
  import { ShortAddress } from '@/utils';
  import { Wallet } from '@aptos-labs/wallet-adapter-core';

  const appStore = useAppStore();

  const { connect } = useWallets();

  const connectWallet = async (wallet: Wallet) => {
    await connect(wallet.name);
  };

  const disconnect = async () => {
    appStore.walletCore.disconnect();
  };

  const APTOS_COIN = '0x1::aptos_coin::AptosCoin';

  const submitting = ref(false);
  const signAndSubmitHandler = async () => {
    if (submitting.value) return;

    try {
      submitting.value = true;
      const result: any = await appStore.walletCore?.signAndSubmitTransaction({
        data: {
          function: '0x1::coin::transfer',
          typeArguments: [APTOS_COIN],
          functionArguments: [appStore.address, 1],
        },
      });

      if (result.hash) {
        snackbarSuccess(`Transaction is successful: ${result.hash}`);
      }
    } catch (err: any) {
      console.log(err);
      snackbarError(err.message || err);
    } finally {
      submitting.value = false;
    }
  };

  const signTransactionHandler = async () => {
    if (submitting.value || !appStore.address) return;
    try {
      submitting.value = true;
      const rawTransaction = await AptosClient.transaction.build.simple({
        sender: appStore.address!,
        data: {
          function: '0x1::coin::transfer',
          typeArguments: [APTOS_COIN],
          functionArguments: [appStore.address, 1],
        },
      });

      const result: any = await appStore.walletCore?.signTransaction(rawTransaction);
      snackbarSuccess(`Transaction signed successfully: ${JSON.stringify(result)}`);
    } catch (err: any) {
      console.log(err);
      snackbarError(err.message || err);
    } finally {
      submitting.value = false;
    }
  };

  const signMessageHandler = async () => {
    try {
      submitting.value = true;

      const result: any = await appStore.walletCore?.signMessage({
        message:
          "Hello from MizuWallet\nWhat's your name?\nwhat's your propose?\nQuick Fox Jump Over the Lazy DogQuick Fox Jump Over the Lazy DogQuick Fox Jump Over the Lazy Dog",
        nonce: Date.now().toString(),
      });
      snackbarSuccess(`Message signed successfully: ${JSON.stringify(result)}`);
    } catch (err: any) {
      console.log(err);
      snackbarError(err.message || err);
    } finally {
      submitting.value = false;
    }
  };
</script>

<route lang="yaml">
meta:
  layout: default
</route>

