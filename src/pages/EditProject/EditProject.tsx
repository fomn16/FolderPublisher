import { IoMdTrash } from "react-icons/io";

import { useEffect, useState } from "react";

import { useAppStateStore } from "../../stores";
import FilteredList from "../../components/FilteredList/FIlteredList";
import useIgnoredFilesStore from "../../stores/useIgnoredFileStore";

import "./EditProject.css"
import { FaCheck, FaMinus, FaPlus } from "react-icons/fa";
import InputWithButtons from "../../components/InputWithButtons";

export default function EditProject(){
    const { modalProps } = useAppStateStore();
    const { isLoading, notifyError } = useAppStateStore()
    const { files, deleteFile, fetchFiles, createFile} = useIgnoredFilesStore();
    const [filteredFiles, setFilteredFiles] = useState<IgnoredFile[]>([]);

    const processFilePath = (filePath:string) => {
        return filePath.replace(/[\/\\]/g, (match) => match + '\u200b');
    };

    useEffect(()=>{fetchFiles(modalProps)},[]);

    const [createActive, setCreateActive] = useState(false);
    const toggleCreate = () => setCreateActive((st) => !st);
    const createClassName = "sliding-div" + (createActive ? " visible" : "")
    const [newFileName, setNewFileName] = useState("");

    const onCreateNewFile = () => {
        if(newFileName === ""){
            notifyError("Nome de arquivo inválido");
            return;
        }
        createFile({
            name: newFileName,
            projectId: modalProps
        });
    }

    return isLoading ? (
        <div>Carregando arquivos...</div>
    ) : (
        <div className="collumns">
            <FilteredList
            items={files}
            setFilteredItems={setFilteredFiles}
            extractKey={(file) => file.name}
            id="projects"
            extraButtons={[{
                onClick: () => toggleCreate(),
                icon: createActive ? FaMinus : FaPlus
            }]}/>
        <div className={ createClassName }>
            <InputWithButtons
                id="CreateIgnoredFileFilter"
                value={newFileName}
                setValue={setNewFileName}
                placeholder="Novo..."
                buttons={[{
                    onClick:() => onCreateNewFile(),
                    icon:FaCheck
                }]}/>
        </div>
        <table>
            <thead>
            <tr>
                <th>Arquivo</th>
                <th>Ações</th>
            </tr>
            </thead>
            <tbody>
            {filteredFiles.map((file) => (
                <tr key={file.id}>
                <td>{processFilePath(file.name)}</td>
                <td>
                    <button className="icon-button list-button" onClick={() => deleteFile(file)}><IoMdTrash/></button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
}