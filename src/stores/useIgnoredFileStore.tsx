import { create } from "zustand";
import { useAppStateStore } from "./index"
import Database from "@tauri-apps/plugin-sql";

type IgnoredFilesStore = {
    files: IgnoredFile[],
    fetchFiles: (projectId: number)=> Promise<void>,
    createFile: (file:Omit<IgnoredFile, "id">) => Promise<void>
    deleteFile: (file: IgnoredFile) => Promise<void>
}

const useIgnoredFilesStore = create<IgnoredFilesStore>()((set, get) => ({
    files:[],
    fetchFiles: async (projectId) => set({files: await getFilesFromDb(projectId)}),
    createFile: async (file) => {
        await createFileInDb(file);
        await get().fetchFiles(file.projectId);
    },
    deleteFile: async (file) => {
        await deleteFileFromDb(file.id);
        await get().fetchFiles(file.projectId);
    }
}));

async function getFilesFromDb(projectId: number) {
    const { startLoading, stopLoading, notifyError } = useAppStateStore.getState();
    try {
      startLoading();
      const db = await Database.load("sqlite:folder_publisher.db");
      const dbFiles = await db.select<IgnoredFile[]>("SELECT * FROM ignoredFiles where projectId = $1", [projectId]);
      return dbFiles;
    } catch (error) {
      console.log(error);
      notifyError("Erro ao ler arquivos");
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
        notifyError("Falha ao inserir arquivo");
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
        notifyError("Erro ao excluir arquivo");
    }
    finally {
      stopLoading();
    }
}

export default useIgnoredFilesStore