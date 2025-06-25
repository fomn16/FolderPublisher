import { create } from "zustand";
import { useAppStateStore } from "./index"
import Database from "@tauri-apps/plugin-sql";

type ChatsStore = {
    chats: Chat[],
    fetchChats: ()=> Promise<void>,
    createChat: (chat:Omit<Chat, "id">) => Promise<void>
    deleteChat: (id: number) => Promise<void>
}

const useChatsStore = create<ChatsStore>()((set, get) => ({
    chats:[],
    fetchChats: async () => set({chats: await getChatsFromDb()}),
    createChat: async (chat) => {
        await createChatInDb(chat);
        await get().fetchChats();
    },
    deleteChat: async (id) => {
        await deleteChatFromDb(id);
        await get().fetchChats();
    }
}));

async function getChatsFromDb() {
    const { startLoading, stopLoading, notifyError } = useAppStateStore.getState();
    try {
      startLoading();
      const db = await Database.load("sqlite:example_app.db");
      const dbChats = await db.select<Chat[]>("SELECT * FROM chats");
      return dbChats;
    } catch (error) {
      console.log(error);
      notifyError("Error reading chats");
    }
    finally{
      stopLoading();
    }
    return [];
}
    
async function createChatInDb(chat: Omit<Chat, "id">) {
    const { startLoading, stopLoading, notifyError } = useAppStateStore.getState();
    try {
        startLoading();
        const db = await Database.load("sqlite:example_app.db");
        await db.execute("INSERT INTO Chats (name) VALUES ($1)", [
            chat.name
        ]);
    } catch (error) {
        console.log(error);
        notifyError("Error inserting chat");
    }
    finally {
      stopLoading();
    }
}

async function deleteChatFromDb(id:number){
    const { startLoading, stopLoading, notifyError } = useAppStateStore.getState();
    try{
        startLoading();
        const db = await Database.load("sqlite:example_app.db");
        await db.execute("delete from chats where id = $1", [id]);
    }
    catch (error){
        console.log(error);
        notifyError("Error excluding chat");
    }
    finally {
      stopLoading();
    }
}

export default useChatsStore