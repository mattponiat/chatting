import type { Message, User } from "@prisma/client";

export type Messages = (Message & {
  author: User;
})[];
