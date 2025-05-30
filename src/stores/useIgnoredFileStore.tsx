import { create } from "zustand";
import { useAppStateStore } from "./index"
import Database from "@tauri-apps/plugin-sql";

type IgnoredFilesStore = {
    files: IgnoredFile[],
    fetchFiles: ()=> Promise<void>,
    createFile: (file:Omit<IgnoredFile, "id">) => Promise<void>
    deleteFile: (id: number) => Promise<void>
}

const useIgnoredFilesStore = create<IgnoredFilesStore>()((set, get) => ({
    files:[],
    fetchFiles: async () => set({files: await getFilesFromDb()}),
    createFile: async (file) => {
        await createFileInDb(file);
        await get().fetchFiles();
    },
    deleteFile: async (id) => {
        await deleteFileFromDb(id);
        await get().fetchFiles();
    }
}));

async function getFilesFromDb() {
    const { startLoading, stopLoading, notifyError } = useAppStateStore.getState();
    try {
      startLoading();
      const db = await Database.load("sqlite:folder_publisher.db");
      const dbFiles = await db.select<IgnoredFile[]>("SELECT * FROM ignoredFiles");
      return dbFiles;
    } catch (error) {
      console.log(error);
      notifyError("Erro ao ler projetos");
    }
    finally{
      stopLoading();
    }
    return [];
}
    
async function createFileInDb(file: Omit<IgnoredFile, "id">) {
    const { startLoading, stopLoading, notifyError } = useAppStateStore.getState();
    try {
        startLoading();
        const db = await Database.load("sqlite:folder_publisher.db");
        await db.execute("INSERT INTO ignoredFiles (name, projectId) VALUES ($1, $2)", [
            file.name,
            file.projectId
        ]);
    } catch (error) {
        console.log(error);
        notifyError("Falha ao inserir projeto");
    }
    finally {
      stopLoading();
    }
}

async function deleteFileFromDb(id:number){
    const { startLoading, stopLoading, notifyError } = useAppStateStore.getState();
    try{
        startLoading();
        const db = await Database.load("sqlite:folder_publisher.db");
        await db.execute("delete from ignoredFiles where id = $1", [id]);
    }
    catch (error){
        console.log(error);
        notifyError("Erro ao excluir projeto");
    }
    finally {
      stopLoading();
    }
}

export default useIgnoredFilesStore