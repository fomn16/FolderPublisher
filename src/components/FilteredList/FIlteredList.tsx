import { MdCancel } from "react-icons/md";

import { Dispatch, useEffect, useState } from "react";
import InputWithButtons, { ButtonInfo } from "../InputWithButtons";
import levenshtein from 'js-levenshtein';

interface Props<T>{
  items: T[]
  setFilteredItems: Dispatch<T[]>
  extractKey: (item: T) => string
  id: string,
  extraButtons?: ButtonInfo[]
}

export default function FilteredList<T>(props: Props<T>){
    const {items, setFilteredItems, extractKey, id, extraButtons} = props;
    const [filter, setFilter] = useState<string>("");
    
    const onClearFilter = async () => {
      setFilter("");
    }

    const applyFilter = async ()=>{
      if(filter!==""){
        setFilteredItems(
          [...items]
          .sort((a,b) => 
            levenshtein(extractKey(a), filter)-levenshtein(extractKey(b),filter)));
      }
      else{
        setFilteredItems([...items]);
      }
    }

    useEffect(()=>{ applyFilter() }, [filter, items]);
    const buttons = extraButtons ? (extraButtons) : []
    return(
          <InputWithButtons
            id={id + "Filter"}
            value={filter}
            setValue={setFilter}
            placeholder="Buscar..."
            buttons={[{
              onClick:onClearFilter,
              icon:MdCancel
            },...buttons]}/>
    );
}