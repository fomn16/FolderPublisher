import { IoMdTrash } from "react-icons/io";
import "./ProjectList.css";
import Database from "@tauri-apps/plugin-sql";
import { Dispatch, useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import InputWithButtons from "../../components/InputWithButtons";
import levenshtein from 'js-levenshtein';

interface Props{
    isLoadingProjects: boolean
    projects: Project[]
    setError: Dispatch<string>
    getProjects: ()=>Promise<void>,
    setIsLoadingProjects: Dispatch<boolean>
}

export default function ProjectList(props:Props){
    const {isLoadingProjects, projects, setError, getProjects, setIsLoadingProjects} = props;

    const handleDelete = async (id:number) =>{
      try{
        setIsLoadingProjects(true);
        const db = await Database.load("sqlite:ANTTPublisher.db");
        await db.execute("delete from projects where id = $1", [id]);

        await getProjects();
      }
      catch (error){
        console.log(error);
        setError("Erro ao excluir projeto");
        setIsLoadingProjects(false);
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

    return isLoadingProjects ? (
        <div>Carregando projetos...</div>
    ) : (
      <div className="collumns">
        <h1>Projetos</h1>
          <InputWithButtons
            id="projectsFilter"
            value={filter}
            setValue={setFilter}
            placeholder="Buscar..."
            buttons={[{
              onClick:onClearFilter,
              icon:MdCancel
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
                <td>{project.filesFrom}</td>
                <td>{project.filesTo}</td>
                <td>
                    <button className="trashButton" onClick={() => handleDelete(project.id)}><IoMdTrash/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}