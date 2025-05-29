import { FormEvent, useState } from "react";
import FolderSelector from "../components/FolderSelector";

import { useAppStateStore, useProjectsStore } from "../stores";

export default function ProjectForm(){
    const [name, setName] = useState<string>("");
    const [filesFrom, setFilesFrom] = useState<string>("");
    const [filesTo, setFilesTo] = useState<string>("");

    const {notifyError, closeModal} = useAppStateStore()
    const {createProject} = useProjectsStore();

    function valid(){
        if(name.length==0 || filesFrom?.length==0 || filesTo?.length==0){
            notifyError("Parâmetros inválidos");
            return false;
        }
        return true;
    }

    async function onSubmit(e:FormEvent<HTMLFormElement>){
        console.log(filesFrom, filesTo)
        e.preventDefault();
        if(valid() && filesFrom && filesTo){
            await createProject({ name, filesFrom, filesTo });
            setName("");
            setFilesFrom("");
            setFilesTo("");
        }
        closeModal();
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