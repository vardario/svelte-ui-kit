<script context="module" lang="ts">
  import type { SizeType, FormSizeType } from '$lib/types';
  export function clampSize(s: SizeType) {
    return s && s === 'xs' ? 'sm' : s === 'xl' ? 'lg' : s;
  }
</script>

<script lang="ts">
  import Wrapper from '$lib/utils/Wrapper.svelte';
  import classNames from 'classnames';
  import { getContext, hasContext } from 'svelte';
  import type { InputType } from '../types';
  import Label from './Label.svelte';
  import { FORM, type FormContext } from './Form.svelte';
  import { Helper } from '$lib';
  import _ from 'lodash';
  import type { Writable } from 'svelte/store';

  export let type: InputType = 'text';
  export let value: string | number = '';
  export let size: FormSizeType | undefined = undefined;
  export let defaultClass: string = 'block w-full disabled:cursor-not-allowed disabled:opacity-50 border';
  export let color: 'base' | 'green' | 'red' = 'base';
  export let label: string | undefined | null = undefined;
  export let helper: string | undefined | null = undefined;
  export let name: string | undefined = undefined;

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

  // tinted if put in component having its own background
  let background: boolean = getContext('background');

  let group: { size: SizeType } = getContext('group');

  // you need to this to avoid 2-way binding
  const setType = (node: HTMLInputElement, _type: string) => {
    node.type = _type;
    return {
      update(_type: string) {
        node.type = _type;
      }
    };
  };

  const textSizes = { sm: 'sm:text-xs', md: 'text-sm', lg: 'sm:text-base' };
  const leftPadding = { sm: 'pl-9', md: 'pl-10', lg: 'pl-11' };
  const rightPadding = { sm: 'pr-9', md: 'pr-10', lg: 'pr-11' };
  const inputPadding = { sm: 'p-2', md: 'p-2.5', lg: 'p-3' };

  $: _size = size || clampSize(group?.size) || 'md';
  let inputClass: string = classNames(
    defaultClass,
    $$slots.left && leftPadding[_size],
    $$slots.right && rightPadding[_size],
    ringClasses[color],
    colorClasses[color],
    borderClasses[color],
    inputPadding[_size],
    textSizes[_size],
    group || 'rounded-lg',
    group && 'first:rounded-l-lg last:rounded-r-lg',
    group && 'border-l-0 first:border-l last:border-r',
    $$props.class
  );
  $: __color = color;
  $: {
    const _color = __color === 'base' && background ? 'tinted' : __color;

    inputClass = classNames(
      defaultClass,
      $$slots.left && leftPadding[_size],
      $$slots.right && rightPadding[_size],
      ringClasses[__color],
      colorClasses[_color],
      borderClasses[_color],
      inputPadding[_size],
      textSizes[_size],
      group || 'rounded-lg',
      group && 'first:rounded-l-lg last:rounded-r-lg',
      group && 'border-l-0 first:border-l last:border-r',
      $$props.class
    );
  }
  let floatClass = 'flex absolute inset-y-0 items-center text-gray-500 dark:text-gray-400';
  let onInput = (event: Event) => {};

  let errors: Writable<{}> | undefined = undefined;
  let error: string | undefined;
  let shouldValidate: Writable<boolean> | undefined = undefined;

  if (hasContext(FORM)) {
    const formContext = getContext<FormContext>(FORM);
    errors = formContext.errors;
    shouldValidate = formContext.shouldValidate;
    value = formContext.getValue(name ?? '', type) as string | number;

    onInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (name) {
        formContext.setValue(name, target.value, type);
      }
    };
  }

  $: {
    error = _.get($errors, name ?? '');
    if ($shouldValidate) {
      // __color = (error && 'red') || 'green';
    }
  }
</script>

<Wrapper class="relative w-full" show={$$slots.left || $$slots.right}>
  {#if $$slots.left}
    <div class="{floatClass} left-0 pl-2.5 pointer-events-none"><slot name="left" /></div>
  {/if}
  <slot props={{ ...$$restProps, class: inputClass }}>
    <div>
      {#if label}
        <Label for={$$restProps.id} class="block mb-2">{label}</Label>
      {/if}
      <input
        bind:value
        on:blur
        on:change
        on:click
        on:contextmenu
        on:focus
        on:keydown
        on:keypress
        on:keyup
        on:mouseover
        on:mouseenter
        on:mouseleave
        on:paste
        on:input={onInput}
        use:setType={type}
        {name}
        class={inputClass}
        {...$$restProps} />
      {#if $$slots.helper}
        <div class="mt-2 font-medium">
          <slot name="helper" />
        </div>
      {:else if helper}
        <Helper class="mt-2"><span class="font-medium">{helper}</span></Helper>
      {/if}
      {#if error}
        <Helper class="mt-2" color="red"><span class="font-medium">{error}</span></Helper>
      {/if}
    </div>
  </slot>
  {#if $$slots.right}
    <div class="{floatClass} right-0 pr-2.5"><slot name="right" /></div>
  {/if}
</Wrapper>
