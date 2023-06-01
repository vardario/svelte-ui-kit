<script context="module" lang="ts">
  export const FORM = Symbol();
  export type FormContext = {
    values: Writable<{}>;
    errors: Writable<{}>;
    touched: Writable<{}>;
    setValue: (path: string, value: string | boolean | number, type: HTMLInputTypeAttribute) => void;
    getValue: (path: string, type: HTMLInputTypeAttribute) => string | boolean | number;
    loading: Writable<boolean>;
    shouldValidate: Writable<boolean>;
  };
  /**
   * @default OnSubmit
   */
  export enum FormValidationMode {
    /**
     * Validation only occurs on submit.
     */
    OnSubmitOnly,
    /**
     * Validation will be triggered on submit
     * and will be triggered on input afterwards.
     */
    OnSubmit,

    /**
     * Validation will be triggered on input change.
     */
    OnInput
  }
</script>

<script lang="ts">
  import { writable, type Writable } from 'svelte/store';
  import { setContext } from 'svelte';
  import _ from 'lodash';
  import type { z, AnyZodObject } from 'zod';
  import { z as zod } from 'zod';

  import type { HTMLInputTypeAttribute } from 'svelte/elements';

  type T = $$Generic<AnyZodObject>;
  type Object = z.infer<typeof schema>;

  //@ts-expect-error
  export let schema: T = zod.any();
  export let object: Partial<Object> | undefined = undefined;
  export let submit: ((values: Object) => Promise<void>) | undefined = undefined;
  export let validationMode: FormValidationMode | undefined = FormValidationMode.OnSubmit;

  const values = writable(object ?? {});
  const validatedValues = writable({});
  const errors = writable({});
  const touched = writable({});
  const loading = writable(false);
  const shouldValidate = writable(validationMode === FormValidationMode.OnInput);

  function setValue(path: string, value: string | boolean | number, type: HTMLInputTypeAttribute) {
    const convertValue = () => {
      if (['number'].includes(type) && typeof value === 'string') {
        return Number.parseFloat(value);
      }

      if (type === 'datetime-local' && typeof value === 'string') {
        try {
          return new Date(value).toISOString();
        } catch (error) {
          return undefined;
        }
      }

      return value === '' ? undefined : value;
    };

    $values = _.set($values, path, convertValue());
    if ($shouldValidate) {
      validateForm();
    }
  }

  function validateForm() {
    if (schema) {
      const parseResult = schema.safeParse($values);

      if (!parseResult.success) {
        $errors = parseResult.error.issues.reduce((acc, issue) => {
          _.set(acc, issue.path.join('.'), issue.message);
          return acc;
        }, {});

        return false;
      }

      $errors = {};
      return true;
    }
  }

  function getValue(path: string, type: HTMLInputTypeAttribute) {
    return _.get($values, path);
  }

  function _submit() {
    if (validationMode === FormValidationMode.OnSubmit) {
      $shouldValidate = true;
    }

    if (validateForm()) {
      $loading = true;
      submit?.($values).finally(() => {
        $loading = false;
      });
    }
  }

  setContext(FORM, {
    validatedValues,
    errors,
    touched,
    setValue,
    getValue,
    loading,
    shouldValidate
  });
</script>

<form {...$$restProps} on:submit|preventDefault={_submit}>
  <slot />
</form>
