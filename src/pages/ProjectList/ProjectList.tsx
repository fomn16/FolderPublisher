import { IoMdTrash, IoMdPlay } from "react-icons/io";
import { MdAdd, MdCancel } from "react-icons/md";

import "./ProjectList.css";
import Database from "@tauri-apps/plugin-sql";
import { Dispatch, useEffect, useState } from "react";
import InputWithButtons from "../../components/InputWithButtons";
import levenshtein from 'js-levenshtein';
import { invoke } from "@tauri-apps/api/core";

interface Props{
    isLoadingProjects: boolean
    projects: Project[]
    setError: Dispatch<string>
    getProjects: ()=>Promise<void>,
    setIsLoadingProjects: Dispatch<boolean>
    onOpenCreate: ()=>void
}

export default function ProjectList(props:Props){
    const {
      isLoadingProjects,
      projects,
      setError,
      getProjects,
      setIsLoadingProjects,
      onOpenCreate
    } = props;

    const handleDelete = async (id:number) =>{
      try{
        setIsLoadingProjects(true);
        const db = await Database.load("sqlite:folder_publisher.db");
        await db.execute("delete from projects where id = $1", [id]);
        await getProjects();
      }
      catch (error){
        console.log(error);
        setError("Erro ao excluir projeto");
        setIsLoadingProjects(false);
      }
    }

    const copyTo = async (src: string, dst: string) => {
      try {
        await invoke('copy_directory', {
          sourceDir: src,
          destinationDir: dst
        });
      } catch (error) {
        console.log(error);
        setError('erro ao copiar arquivos')
      }
    }

    const [filter, setFilter] = useState<string>("");
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const onClearFilter = async () => {
      setFilter("");
    }
    const applyFilter = async ()=>{
      if(filter!==""){
        setFilteredProjects(
          [...projects]
          .sort((a,b) => 
            levenshtein(a.name, filter)-(levenshtein(b.name,filter))));
      }
      else{
        setFilteredProjects([...projects]);
      }
    }

    useEffect(()=>{ applyFilter() }, [filter, projects]);

    const processFilePath = (filePath:string) => {
      return filePath.replace(/[\/\\]/g, (match) => match + '\u200b');
    };

    return isLoadingProjects ? (
        <div>Carregando projetos...</div>
    ) : (
      <div className="collumns">
          <InputWithButtons
            id="projectsFilter"
            value={filter}
            setValue={setFilter}
            placeholder="Buscar..."
            buttons={[{
              onClick:onClearFilter,
              icon:MdCancel
            },{
              onClick:onOpenCreate,
              icon:MdAdd
            }]}/>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Origem dos Arquivos</th>
              <th>Destino dos Arquivos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id}>
                <td>{project.name}</td>
                <td>{processFilePath(project.filesFrom)}</td>
                <td>{processFilePath(project.filesTo)}</td>
                <td>
                  <div className="list-buttons">
                    <button className="icon-button list-button" onClick={() => handleDelete(project.id)}><IoMdTrash/></button>
                    <button className="icon-button list-button" onClick={() => copyTo(project.filesFrom, project.filesTo)}><IoMdPlay/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}