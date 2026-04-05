// @ts-nocheck
import { EventSchemas } from "inngest";

export const inngestSchemas = new EventSchemas().fromRecord({
  "studio/generate.requested": {
    data: {
      generationId: "",
      inputUrl: "",
      prompt: "",
      category: "",
    },
  },
});
