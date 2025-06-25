import { IoMdTrash } from "react-icons/io";

import { useEffect, useState } from "react";

import { useAppStateStore } from "../../stores";
import useMessagesStore from "../../stores/useMessagesStore";

import "./ViewChat.css"
import { FaCheck } from "react-icons/fa";
import InputWithButtons from "../../components/InputWithButtons";
import { number } from "framer-motion";

export default function EditProject(){
    const { modalProps } = useAppStateStore();
    const { isLoading } = useAppStateStore()
    const { messages, deleteMessage, fetchMessages, createMessage} = useMessagesStore();

    useEffect(()=>{fetchMessages(modalProps)},[modalProps]);
    const [newMessage, setNewMessage] = useState("");

    const onCreateNewMessage = () => {
        if(newMessage === "")
            return;
        createMessage({
            content: newMessage,
            chatId: modalProps
        });
        setNewMessage("")
    }

    if(typeof(modalProps) !== "number")
        return <div>Start a new chat!</div>
    return isLoading ? (
        <div>Loading Messages...</div>
    ) : (
        <div className="collumns innerChatSpace">
            <div className="userArea">
                <InputWithButtons
                    id="CreateMessage"
                    value={newMessage}
                    setValue={setNewMessage}
                    placeholder="Ask me anything"
                    buttons={[{
                        onClick:() => onCreateNewMessage(),
                        icon:FaCheck
                    }]}/>
            </div>
            <ul>
                {messages.map((message) => (
                    <li key={message.id} className={message.issuer == 1 ? "myMessage" : "someonesMessage"}>
                        {message.content}
                        <button className="icon-button list-button" onClick={() => deleteMessage(message)}><IoMdTrash/></button>
                    </li>
                ))}
            </ul>
        </div>
    );
}