<script lang="ts">
  import { getContext, hasContext } from 'svelte';
  import type { FormColorType } from '../types';
  import { labelClass, inputClass } from './Radio.svelte';
  import Label from './Label.svelte';
  import type { Writable } from 'svelte/store';
  import { FORM, type FormContext } from './Form.svelte';
  import { Helper } from '$lib';
  import _ from 'lodash';

  // properties forwarding
  export let color: FormColorType = 'primary';
  export let custom: boolean = false;
  export let inline: boolean = false;

  export let group: (string | number)[] = [];
  export let value: string | number = '';
  export let checked: boolean | undefined = undefined;
  export let name: string | undefined = undefined;

  // tinted if put in component having its own background
  let background: boolean = getContext('background');

  // react on external group changes
  function init(_: HTMLElement, _group: (string | number)[]) {
    if (checked === undefined) checked = _group.includes(value);
    onChange();

    return {
      update(_group: (string | number)[]) {
        checked = _group.includes(value);
      }
    };
  }

  function onChange() {
    // There's a bug in Svelte and bind:group is not working with wrapped checkbox
    // This workaround is taken from:
    // https://svelte.dev/repl/de117399559f4e7e9e14e2fc9ab243cc?version=3.12.1
    const index = group.indexOf(value);

    if (checked === undefined) checked = index >= 0;

    if (checked) {
      if (index < 0) {
        group.push(value);
        group = group;
      }
    } else {
      if (index >= 0) {
        group.splice(index, 1);
        group = group;
      }
    }
  }

  let errors: Writable<{}> | undefined = undefined;
  let error: string | undefined;
  let shouldValidate: Writable<boolean> | undefined = undefined;
  let onInput = (event: Event) => {};

  if (hasContext(FORM)) {
    const formContext = getContext<FormContext>(FORM);
    errors = formContext.errors;
    shouldValidate = formContext.shouldValidate;

    onInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      console.log('checkbox', target.checked);
      if (name) {
        formContext.setValue(name, target.checked, 'checkbox');
      }
    };

    const defaultValue = formContext.getValue(name ?? '', 'checkbox');
    checked = typeof defaultValue === 'boolean' ? defaultValue : false;
  }

  $: {
    error = _.get($errors, name ?? '');
    if ($shouldValidate) {
    }
  }
</script>

<div>
  <Label class={labelClass(inline, $$props.class)} show={!!$$slots.default}>
    <input
      use:init={group}
      type="checkbox"
      bind:checked
      on:input={onInput}
      on:keyup
      on:keydown
      on:keypress
      on:focus
      on:blur
      on:click
      on:mouseover
      on:mouseenter
      on:mouseleave
      on:paste
      on:change={onChange}
      on:change
      {value}
      {...$$restProps}
      class={inputClass(custom, color, true, background, $$slots.default || $$props.class)} /><slot />
  </Label>
  {#if error}
    <Helper class="mt-2" color="red"><span class="font-medium">{error}</span></Helper>
  {/if}
</div>
