import { Inngest } from "inngest";
import { inngestSchemas } from "./types";

// Define our Inngest client with a unique app name and strict types
export const inngest = new Inngest({ id: "lumina-ai-studio", schemas: inngestSchemas });
