import { open } from '@tauri-apps/plugin-dialog';
import { Dispatch } from 'react';
import { MdMoreVert } from 'react-icons/md';
import InputWithButtons from './InputWithButtons';

interface Props{
    id: string
    placeholder: string
    value: string
    setValue: Dispatch<string>
}

export default function FolderSelector(props: Props){
  const {placeholder, id, value, setValue} = props

  const handleSelectFromFolder = async () => {
      try {
        const selected = await open({
          directory: true,
          multiple: false,
          title: 'Select a folder',
        });
  
        if (selected) {
          setValue(selected);
        }
      } catch (error) {
        console.error('Error selecting folder:', error);
      }
  };

  return(
      <InputWithButtons
        id={id}
        value={value}
        placeholder={placeholder}
        buttons={[{
          onClick:handleSelectFromFolder,
          icon:MdMoreVert
        }]}/>
  );
}