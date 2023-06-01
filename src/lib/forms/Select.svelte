<script lang="ts">
  import classNames from 'classnames';
  import type { SelectOptionType } from '../types';
  import { Helper, Label } from '$lib';
  import type { Writable } from 'svelte/store';
  import { hasContext } from 'svelte';
  import { FORM, type FormContext } from './Form.svelte';
  import { getContext } from 'svelte';
  import { get} from 'lodash';

  export let items: SelectOptionType[] = [];
  export let value: string | number;
  export let placeholder: string = 'Choose option ...';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let name: string | undefined = undefined;
  export let label: string | undefined = undefined;
  export let helper: string | undefined = undefined;
  export let color: 'base' | 'green' | 'red' = 'base';

  let __color = color;

  const borderClasses = {
    base: 'border-gray-300 dark:border-gray-600',
    tinted: 'border-gray-300 dark:border-gray-500',
    green: 'border-green-500 dark:border-green-400',
    red: 'border-red-500 dark:border-red-400'
  };

  const ringClasses = {
    base: 'focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500',
    green: 'focus:ring-green-500 focus:border-green-500 dark:focus:border-green-500 dark:focus:ring-green-500',
    red: 'focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500'
  };

  const colorClasses = {
    base: 'bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400',
    tinted: 'bg-gray-50 text-gray-900 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400',
    green:
      'bg-green-50 text-green-900 placeholder-green-700 dark:text-green-400 dark:placeholder-green-500 dark:bg-gray-700',
    red: 'bg-red-50 text-red-900 placeholder-red-700 dark:text-red-500 dark:placeholder-red-500 dark:bg-gray-700'
  };

  let background: boolean = getContext('background');

  const common = 'block w-full';
  const sizes = {
    sm: 'text-sm p-2',
    md: 'text-sm p-2.5',
    lg: 'text-base py-3 px-4'
  };

  let errors: Writable<{}> | undefined = undefined;
  let error: string | undefined;
  let onInput = (event: Event) => {};
  let shouldValidate: Writable<boolean> | undefined = undefined;

  if (hasContext(FORM)) {
    const formContext = getContext<FormContext>(FORM);
    errors = formContext.errors;
    const defaultValue = formContext.getValue(name ?? '', 'text');
    value = typeof defaultValue === 'string' ? defaultValue : '';
    shouldValidate = formContext.shouldValidate;

    onInput = (event: Event) => {
      const target = event.target as HTMLSelectElement;
      if (name) {
        formContext.setValue(name, target.value, 'text');
      }
    };
  }

  $: __color = color;

  let selectClass: string;
  $: {
    const _color = __color === 'base' && background ? 'tinted' : __color;
    selectClass = classNames(
      common,
      sizes[size],
      ringClasses[__color],
      colorClasses[_color],
      borderClasses[_color],
      'rounded-lg',
      $$props.class
    );
  }

  $: {
    error = get($errors, name ?? '');
  }
</script>

<div>
  {#if label}
    <Label for={$$restProps.id} class="block mb-2">{label}</Label>
  {/if}
  <select {...$$restProps} bind:value class={selectClass} on:change on:input={onInput} on:contextmenu on:input {name}>
    {#if placeholder}
      <option disabled selected value="">{placeholder}</option>
    {/if}

    {#each items as { value, name }}
      <option {value}>{name}</option>
    {:else}
      <slot />
    {/each}
  </select>
  {#if helper}
    <Helper class="mt-2"><span class="font-medium">{helper}</span></Helper>
  {/if}
  {#if error}
    <Helper class="mt-2" color="red"><span class="font-medium">{error}</span></Helper>
  {/if}
</div>
