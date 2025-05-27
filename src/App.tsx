import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

import ProjectForm from "./pages/ProjectForm";
import Database from "@tauri-apps/plugin-sql";

import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import ProjectList from "./pages/ProjectList/ProjectList";

function App() {
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string>("");

  async function getProjects() {
    try {
      setIsLoadingProjects(true);
      const db = await Database.load("sqlite:ANTTPublisher.db");
      const dbProjects = await db.select<Project[]>("SELECT * FROM projects");
      setProjects(dbProjects);
    } catch (error) {
      console.log(error);
      setError("Erro ao ler projetos");
    }
    finally{
      setIsLoadingProjects(false);
    }
  }

  useEffect(()=>{
    getProjects();
  }, []);

  useEffect(() => {
    if (error !== '') {
      toast.error(error);

      const timer = setTimeout(() => {
        setError('');
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [error]);


  return (
    <main className="container">
      <ToastContainer/>

      <div className="collumns">
        <ProjectForm
          setIsLoadingProjects={setIsLoadingProjects}
          getProjects={getProjects}
          setError={setError}/>
        <ProjectList
          isLoadingProjects={isLoadingProjects}
          projects={projects}
          setError={setError}
          getProjects={getProjects}
          setIsLoadingProjects={setIsLoadingProjects}/>
      </div>
    </main>
  );
}

export default App;
