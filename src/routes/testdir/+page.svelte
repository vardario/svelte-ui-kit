<script lang="ts">
  import { Form, Input, Card, Button, Select, Checkbox, Toggle } from '$lib';
  import { z } from 'zod';
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<main class="h-screen w-screen flex">
  <div class="m-auto">
    <Card class="w-96 px-4">
      <Form
        schema={data.schema}
        object={data.data}
        class="flex flex-col gap-2"
        submit={async (values) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              console.log(values);
              resolve();
            }, 1500);
          });
        }}>
        <Input type="text" name="first_name" placeholder="John" label="First Name"/>
        <Input type="text" name="last_name" placeholder="Doe" label="Last Name" />
        <Input type="text" name="email" placeholder="Email" label="E-Mail" />
        <Input type="datetime-local" name="date" placeholder="" label="Birthday" />
        <Select
          label="Language"
          name="lng"
          items={[
            { value: 'de', name: 'german' },
            { value: 'en-US', name: 'english' }
          ]}
          value="" />
        <Checkbox name="toc">TOC</Checkbox>
        <Toggle name="marketing">Marketing</Toggle>
        <Button type="submit">Submit</Button>
      </Form>
    </Card>
  </div>
</main>
