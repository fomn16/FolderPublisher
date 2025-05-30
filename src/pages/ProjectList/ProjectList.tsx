import { IoMdTrash, IoMdPlay } from "react-icons/io";
import { MdAdd, MdEdit } from "react-icons/md";

import "./ProjectList.css";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import { useAppStateStore, useProjectsStore } from "../../stores";
import FilteredList from "../../components/FilteredList/FIlteredList";

export default function ProjectList(){
    const { notifyError, isLoading, setActiveModal} = useAppStateStore()
    const { projects, deleteProject } = useProjectsStore();
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

    const processFilePath = (filePath:string) => {
      return filePath.replace(/[\/\\]/g, (match) => match + '\u200b');
    };

    return isLoading ? (
        <div>Carregando projetos...</div>
    ) : (
      <div className="collumns">
          <FilteredList
            items={projects}
            setFilteredItems={setFilteredProjects}
            extractKey={(project) => project.name}
            id="projects"
            extraButtons={[{
              onClick: () => setActiveModal("CreateProject"),
              icon: MdAdd
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