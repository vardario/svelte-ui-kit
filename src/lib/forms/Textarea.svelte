<script lang="ts">
  import classNames from 'classnames';
  import { getContext, hasContext } from 'svelte';
  import Wrapper from '../utils/Wrapper.svelte';
  import { Helper, Label } from '$lib';
  import type { Writable } from 'svelte/store';
  import { FORM, type FormContext } from './Form.svelte';
  import _ from 'lodash';

  const background = getContext('background');

  export let value: string = '';
  export let name: string | undefined = undefined;
  export let label: string | undefined | null = undefined;

  let wrapped: boolean;
  $: wrapped = $$slots.header || $$slots.footer;

  let wrapperClass: string;
  $: wrapperClass = classNames(
    'w-full rounded-lg',
    background ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700',
    'text-gray-900 dark:placeholder-gray-400 dark:text-white ',
    'border border-gray-200 dark:border-gray-600',
    $$props.class
  );

  let textareaClass: string;
  $: textareaClass = wrapped
    ? classNames(
        'block w-full',
        'text-sm',
        'border-0 px-0',
        'bg-inherit dark:bg-inherit',
        'focus:outline-none focus:ring-0'
      )
    : classNames(
        wrapperClass,
        'p-2.5 text-sm',
        'focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500'
      );

  const headerClass = (header: boolean) =>
    classNames(header ? 'border-b' : 'border-t', 'py-2 px-3 border-gray-200 dark:border-gray-600');

  let innerWrapperClass: string;
  $: innerWrapperClass = classNames(
    'py-2 px-4 bg-white dark:bg-gray-800',
    $$slots.footer || 'rounded-b-lg',
    $$slots.header || 'rounded-t-lg'
  );

  let onInput = (event: Event) => {};

  let errors: Writable<{}> | undefined = undefined;
  let error: string | undefined;
  let shouldValidate: Writable<boolean> | undefined = undefined;

  if (hasContext(FORM)) {
    const formContext = getContext<FormContext>(FORM);
    errors = formContext.errors;
    shouldValidate = formContext.shouldValidate;
    value = formContext.getValue(name ?? '', 'text') as string;

    onInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (name) {
        formContext.setValue(name, target.value, 'text');
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

<Wrapper show={wrapped} class={wrapperClass}>
  {#if $$slots.header}
    <div class={headerClass(true)}>
      <slot name="header" />
    </div>
  {/if}
  <Wrapper show={wrapped} class={innerWrapperClass}>
    {#if label}
      <Label for={$$restProps.id} class="block mb-2">{label}</Label>
    {/if}
    <textarea
      {name}
      bind:value
      on:blur
      on:change
      on:click
      on:contextmenu
      on:focus
      on:input
      on:keydown
      on:keypress
      on:keyup
      on:mouseenter
      on:mouseleave
      on:mouseover
      on:paste
      on:input={onInput}
      {...$$restProps}
      class={textareaClass} />
    {#if error}
      <Helper class="mt-2" color="red"><span class="font-medium">{error}</span></Helper>
    {/if}
  </Wrapper>
  {#if $$slots.footer}
    <div class={headerClass(false)}>
      <slot name="footer" />
    </div>
  {/if}
</Wrapper>
