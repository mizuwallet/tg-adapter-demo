<template>
  <div class="fz-input">
    <!-- prefix icon -->
    <component
      v-if="prefixIcon"
      :is="prefixIcon"
      class="cursor-pointer"
      color="#aaa"
      @click="emits('click:prefixIcon')"
    ></component>
    <!-- prefix content -->
    <span v-if="prefix">{{ prefix }}</span>
    <!-- prefix slot -->
    <slot name="prefix"></slot>

    <input
      :type="type === 'number' ? 'text' : type"
      v-model.trim="value"
      @input="inputHandler"
      v-bind="$attrs"
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
    />

    <!-- suffix icon -->
    <component
      v-if="suffixIcon"
      :is="suffixIcon"
      class="cursor-pointer"
      @click="emits('click:suffixIcon')"
    ></component>
    <!-- suffix content -->
    <span v-if="suffix">{{ suffix }}</span>
    <!-- suffix slot -->
    <slot name="suffix"></slot>
  </div>
</template>

<script lang="ts" setup>
  import { NumericConstraint } from '@/helpers/InputHelper';
  import { FunctionalComponent } from 'vue';

  const props = withDefaults(
    defineProps<{
      modelValue: string | number;
      type: 'text' | 'number' | 'password' | 'email' | 'tel' | 'url';
      // Optional Props
      prefixIcon?: FunctionalComponent;
      suffixIcon?: FunctionalComponent;
      prefix?: string;
      suffix?: string;
      //   for type === 'number'
      decimals?: number;
      min?: number;
      max?: number;
    }>(),
    {},
  );

  const emits = defineEmits<{
    input: [value: string | number];
    'update:modelValue': [value: string | number];
    'click:prefixIcon': [];
    'click:suffixIcon': [];
  }>();

  const value = ref<any>(props.modelValue);
  const inputHandler = (event: Event) => {
    let inputValue = (event.target as HTMLInputElement).value;
    switch (props.type) {
      case 'number':
        // why should add '' here?
        value.value =
          NumericConstraint(inputValue, {
            decimals: props.decimals,
            min: props.min,
            max: props.max,
          }) + '';
        break;
      default:
        value.value = inputValue;
    }
    emits('update:modelValue', value.value);
  };

  watch(
    () => props.modelValue,
    () => {
      value.value = props.modelValue;
    },
  );
</script>

<style lang="less" scoped>
  .fz-input {
    @apply bg-white px-4 py-10px;
    @apply rounded-3 flex items-center gap-1;

    input {
      @apply bg-transparent w-full;
    }
  }
</style>

