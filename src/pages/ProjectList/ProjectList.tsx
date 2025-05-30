import { IoMdTrash, IoMdPlay } from "react-icons/io";
import { MdAdd, MdCancel, MdEdit } from "react-icons/md";

import "./ProjectList.css";
import { useEffect, useState } from "react";
import InputWithButtons from "../../components/InputWithButtons";
import levenshtein from 'js-levenshtein';
import { invoke } from "@tauri-apps/api/core";

import { useAppStateStore, useProjectsStore } from "../../stores";

export default function ProjectList(){

    const { notifyError, isLoading, setActiveModal} = useAppStateStore()

    const { projects, deleteProject } = useProjectsStore();
    const [filter, setFilter] = useState<string>("");
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

    const copyTo = async (src: string, dst: string) => {
      try {
        await invoke('copy_directory', {
          sourceDir: src,
          destinationDir: dst
        });
      } catch (error) {
        console.log(error);
        notifyError('erro ao copiar arquivos')
      }
    }
    
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

    return isLoading ? (
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
              onClick: () => setActiveModal("CreateProject"),
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
                    <button className="icon-button list-button" onClick={() => deleteProject(project.id)}><IoMdTrash/></button>
                    <button className="icon-button list-button" onClick={() => copyTo(project.filesFrom, project.filesTo)}><IoMdPlay/></button>
                    <button className="icon-button list-button" onClick={() => setActiveModal("EditProject", project.id)}><MdEdit/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}