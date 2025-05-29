import { create } from "zustand";
import { useAppStateStore } from "./index"
import Database from "@tauri-apps/plugin-sql";

type ProjectsStore = {
    projects: Project[],
    fetchProjects: ()=> Promise<void>,
    createProject: (project:Omit<Project, "id">) => Promise<void>
    deleteProject: (id: number) => Promise<void>
}

const startLoading = () => useAppStateStore.getState().startLoading()
const stopLoading = () => useAppStateStore.getState().stopLoading()
const notifyError = (message:string) => useAppStateStore.getState().notifyError(message)

const useProjectsStore = create<ProjectsStore>()((set, get) => ({
    projects:[],
    fetchProjects: async () => set({projects: await getProjectsFromDb()}),
    createProject: async (project) => {
        await createProjectInDb(project);
        await get().fetchProjects();
    },
    deleteProject: async (id) => {
        await deleteProjectFromDb(id);
        await get().fetchProjects();
    }
}));

async function getProjectsFromDb() {
    try {
      startLoading();
      const db = await Database.load("sqlite:folder_publisher.db");
      const dbProjects = await db.select<Project[]>("SELECT * FROM projects");
      return dbProjects;
    } catch (error) {
      console.log(error);
      notifyError("Erro ao ler projetos");
    }
    finally{
      stopLoading();
    }
    return [];
}
    
async function createProjectInDb(project: Omit<Project, "id">) {
    try {
        startLoading();
        const db = await Database.load("sqlite:folder_publisher.db");
        await db.execute("INSERT INTO projects (name, filesFrom, filesTo) VALUES ($1, $2, $3)", [
            project.name,
            project.filesFrom,
            project.filesTo
        ]);
    } catch (error) {
        console.log(error);
        notifyError("Falha ao inserir projeto");
    }
    finally {
      stopLoading();
    }
}

async function deleteProjectFromDb(id:number){
    try{
        startLoading();
        const db = await Database.load("sqlite:folder_publisher.db");
        await db.execute("delete from projects where id = $1", [id]);
    }
    catch (error){
        console.log(error);
        notifyError("Erro ao excluir projeto");
    }
    finally {
      stopLoading();
    }
}

export default useProjectsStore