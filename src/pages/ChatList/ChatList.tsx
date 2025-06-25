import { FaEllipsisH } from "react-icons/fa";

import "./ChatList.css";
import { useState } from "react";

import { useAppStateStore, useChatsStore } from "../../stores";
import FilteredList from "../../components/FilteredList/FIlteredList";
import { FaPlusCircle, FaSearch } from "react-icons/fa";
import InputWithButtons from "../../components/InputWithButtons";

export default function ChatList(){
    const { isLoading, setActiveModal, modalProps} = useAppStateStore()
    const { chats, deleteChat, createChat } = useChatsStore();
    const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
    const [newChatName, setNewChatName] = useState<string>("");

    const makeNewChat = async () => {
      const newName = newChatName == "" ? "New Chat" : newChatName
      await createChat({name:newName});
      setNewChatName("");
    }

    return isLoading ? (
        <div>Loading...</div>
    ) : (
      <div className="collumns chatList">
          <InputWithButtons
            id="new"
            value={newChatName}
            setValue={setNewChatName}
            placeholder="New Chat"
            inverted
            buttons={[{
              onClick:makeNewChat,
              icon:FaPlusCircle
            }]}/>
          <FilteredList
            items={chats}
            setFilteredItems={setFilteredChats}
            extractKey={(chat) => chat.name}
            id="chats"
            extraButtons={[{onClick: () => {},
                            icon: FaSearch}]}/>
            <div className="lastChatSpan">Last Chats</div>
            <ul>
              {filteredChats.map((chat) => (
                <li key={chat.id} onClick={() => setActiveModal("EditChat", chat.id)} className={modalProps == chat.id ? "active" : ""}>
                  {chat.name}
                  <button className="icon-button list-button" onClick={() => deleteChat(chat.id)}><FaEllipsisH/></button>
                </li>
              ))}
            </ul>
      </div>
    );
}