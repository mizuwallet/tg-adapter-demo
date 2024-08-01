<template>
  <button
    class="cursor-pointer bg-primary active:bg-primary/70 transition-all px-6 rounded-3 text-white w-full h-50px font-semibold relative overflow-hidden border-1 border-solid border-transparent"
    :class="{
      '!bg-[#7474801F] !text-text !border-transparent': secondary,
      'cursor-wait': loading,
      'grayscale cursor-not-allowed': disabled,
    }"
    @click="
      (evt:any) => {
        if (loading || disabled) {
          evt.preventDefault();
          evt.stopPropagation();
        }else{
          emits('click', evt);
        }
      }
    "
  >
    <div
      class="w-full h-full bg-gray/20 absolute z-1 top-0 left-0 flex-center pointer-event-none opacity-0 transition-all duration-400"
      :class="{
        'opacity-100': loading,
      }"
    >
      <LoaderCircle :size="28" class="animate-spin" color="gray" />
    </div>
    <div
      class="flex-center gap-6px transition-all"
      :class="{
        'opacity-0': loading,
      }"
    >
      <div class="w-6 h-6 flex-center rounded-full bg-white p-1" v-if="icon">
        <component :is="icon" color="#2151CC" :size="18"></component>
      </div>
      <slot></slot>
    </div>
  </button>
</template>

<script lang="ts" setup>
  import { LoaderCircle } from 'lucide-vue-next';
  import { FunctionalComponent } from 'vue';

  withDefaults(
    defineProps<{
      icon?: FunctionalComponent;
      secondary?: boolean;
      loading?: boolean;
      disabled?: boolean;
    }>(),
    {},
  );
  const emits = defineEmits(['click']);
</script>

<style lang="less" scoped></style>

