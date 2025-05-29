import { Dispatch, FormEvent, useState } from "react";
import Database from "@tauri-apps/plugin-sql";
import FolderSelector from "../components/FolderSelector";

interface Props{
    setIsLoadingProjects: Dispatch<boolean>,
    getProjects: ()=>Promise<void>,
    setError:Dispatch<string>,
    onSubmitAlso: ()=>void
}

export default function ProjectForm(props:Props){
    
    const {setIsLoadingProjects, getProjects, setError, onSubmitAlso} = props
    const [name, setName] = useState<string>("");
    const [filesFrom, setFilesFrom] = useState<string>("");
    const [filesTo, setFilesTo] = useState<string>("");
    
    async function setProject(project: Omit<Project, "id">) {
        try {
            setIsLoadingProjects(true);
            const db = await Database.load("sqlite:folder_publisher.db");
            await db.execute("INSERT INTO projects (name, filesFrom, filesTo) VALUES ($1, $2, $3)", [
            project.name,
            project.filesFrom,
            project.filesTo
            ]);
            await getProjects();
        } catch (error) {
            console.log(error);
            setError("Falha ao inserir projeto");
            setIsLoadingProjects(false);
        }
    }

    function valid(){
        if(name.length==0 || filesFrom?.length==0 || filesTo?.length==0){
            setError("Parâmetros inválidos");
            return false;
        }
        return true;
    }

    async function onSubmit(e:FormEvent<HTMLFormElement>){
        console.log(filesFrom, filesTo)
        e.preventDefault();
        if(valid() && filesFrom && filesTo){
            await setProject({ name, filesFrom, filesTo });
            setName("");
            setFilesFrom("");
            setFilesTo("");
        }
        onSubmitAlso();
    }

    return (<form
    className="row"
    onSubmit={onSubmit}
    style={{maxWidth:"600px", minWidth:'350px'}}
    >
        <div className="collumns">
            <input
            id="name-input"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Digite o nome do projeto..."
            />
            <FolderSelector
            id="filesFrom"
            placeholder="Selecione a origem dos arquivos..."
            value={filesFrom}
            setValue={setFilesFrom}/>
            <FolderSelector
            id="filesTo"
            placeholder="Selecione o destino dos arquivos..."
            value={filesTo}
            setValue={setFilesTo}
            />
            <button type="submit" style={{maxWidth:"300px", marginTop:"50px"}}>Adicionar Projeto</button>
        </div>
    </form>)
}