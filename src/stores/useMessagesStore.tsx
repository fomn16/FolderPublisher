import { create } from "zustand";
import { useAppStateStore } from "./index"
import Database from "@tauri-apps/plugin-sql";

type MessagesStore = {
    messages: Message[],
    fetchMessages: (chatId: number)=> Promise<void>,
    createMessage: (message:Omit<Message, "id" | "issuer">) => Promise<void>
    deleteMessage: (message: Message) => Promise<void>
}

const useMessagesStore = create<MessagesStore>()((set, get) => ({
    messages:[],
    fetchMessages: async (chatId) => set({messages: await getMessagesFromDb(chatId)}),
    createMessage: async (message) => {
        await createMessageInDb(message);
        await get().fetchMessages(message.chatId);
    },
    deleteMessage: async (message) => {
        await deleteMessageFromDb(message.id);
        await get().fetchMessages(message.chatId);
    }
}));

async function getMessagesFromDb(chatId: number) {
    const { startLoading, stopLoading, notifyError } = useAppStateStore.getState();
    try {
      startLoading();
      const db = await Database.load("sqlite:example_app.db");
      const dbMessages = await db.select<Message[]>("SELECT * FROM messages where chatID = $1", [chatId]);
      return dbMessages;
    } catch (error) {
      console.log(error);
      notifyError("Error reading message");
    }
    finally{
      stopLoading();
    }
    return [];
}
    
async function createMessageInDb(message: Omit<Message, "id" | "issuer">) {
    const { startLoading, stopLoading, notifyError } = useAppStateStore.getState();
    try {
        startLoading();
        const db = await Database.load("sqlite:example_app.db");
        await db.execute("INSERT INTO messages (content, chatId, issuer) VALUES ($1, $2, $3)", [
            message.content,
            message.chatId,
            Math.random() < 0.5 ? 1 : 2
        ]);
    } catch (error) {
        console.log(error);
        notifyError("Error creating message");
    }
    finally {
      stopLoading();
    }
}

async function deleteMessageFromDb(id:number){
    const { startLoading, stopLoading, notifyError } = useAppStateStore.getState();
    try{
        startLoading();
        const db = await Database.load("sqlite:example_app.db");
        await db.execute("delete from messages where id = $1", [id]);
    }
    catch (error){
        console.log(error);
        notifyError("Error deleting message");
    }
    finally {
      stopLoading();
    }
}

export default useMessagesStore