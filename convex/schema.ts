import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { conversationTable } from "./tables";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  conversations: conversationTable
});
