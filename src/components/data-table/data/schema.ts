import { z } from "zod";

export const schema = z.object({
  username: z.string(),
  feedbackText: z.string(),
  statusName: z.string(),
  categoryName: z.string(),
});

export type Feedback = z.infer<typeof schema>;
