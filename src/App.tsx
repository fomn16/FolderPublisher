import { useEffect } from "react";
import { ToastContainer } from 'react-toastify';

import ProjectForm from "./pages/ProjectForm";

import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import ProjectList from "./pages/ProjectList/ProjectList";
import AnimatedCard from "./components/AnimatedCard/AnimatedCard";

import { useProjectsStore } from "./stores";
import EditProject from "./pages/EditProject/EditProject";

function App() {
  const { fetchProjects } = useProjectsStore();

  useEffect(() =>{
    fetchProjects();
  }, []);

  return (
    <main className="container">
      <ToastContainer/>
      <div className="collumns">
        <ProjectList/>
        <AnimatedCard type="CreateProject"><ProjectForm/></AnimatedCard>
        <AnimatedCard type="EditProject"><EditProject/></AnimatedCard>
      </div>
    </main>
  );
}

export default App;
