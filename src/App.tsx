import { useEffect } from "react";
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import ChatList from "./pages/ChatList/ChatList"

import { useChatsStore } from "./stores";
import ViewChat from "./pages/ViewChat/ViewChat";
import { dataDir } from "@tauri-apps/api/path";

async function findDatabasePath() {
  const dataDirectory = await dataDir();
  console.log("Database Path:", `${dataDirectory}example_app.db`);
}

function App() {
  const { fetchChats } = useChatsStore();

  useEffect(() =>{
    fetchChats();
    findDatabasePath();
  }, []);

  return (
    <main className="container">
      <ToastContainer/>
      <div className="chatSpace">
        <div className="sidebar">
          <ChatList/>
        </div>
        <div className="viewChat">
          <ViewChat/>
        </div>
      </div>
    </main>
  );
}

export default App;
