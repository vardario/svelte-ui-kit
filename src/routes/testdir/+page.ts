import { z } from 'zod';
import type { PageLoad } from './$types';

const schema = z.object({
  date: z.string().datetime(),
  first_name: z.string().min(3),
  last_name: z.string().min(2),
  email: z.string().email(),
  lng: z.string(),
  toc: z.literal<boolean>(true),
  marketing: z.literal<boolean>(true)
});

export const load = (async () => {
  return {
    schema,
    data: {
      toc: false,
      marketing:false
    }
  };
}) satisfies PageLoad;
