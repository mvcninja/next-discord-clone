import { db } from "@/lib/db";

const findConversation = async (conversationId: string) => {
  const conversation = await db.conversation.findUnique({
    where: {
      id: conversationId
    },
    include: {
      members: {
        include: {
          profile: true,
        }
      }
    }
  });
}

const createConversation = async (memberIds: { id: string }[]) => {
  try {
    const conversation = await db.conversation.create({
      data: {
        members: {
          connect: memberIds
        }
      }
    });

    return conversation;
  } catch (error) {
    console.error("[CREATE_CONVERSATION]", error);
    return null;
  }
}
