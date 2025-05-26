import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

import Database from "@tauri-apps/plugin-sql";

type Project = {
  id: number;
  name: string;
  filesFrom: string;
  filesTo: string;
}

type IgnoredFile = {
  id: number;
  name: string;
  projectId: number;
}

function App() {
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState<string>("");
  const [filesFrom, setFilesFrom] = useState<string>("");
  const [filesTo, setFilesTo] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function getProjects() {
    try {
      const db = await Database.load("sqlite:ANTTPublisher.db");
      const dbProjects = await db.select<Project[]>("SELECT * FROM projects");

      setError("");
      setProjects(dbProjects);
      setIsLoadingProjects(false);
    } catch (error) {
      console.log(error);
      setError("Erro ao ler projetos");
    }
  }

  async function setProject(project: Omit<Project, "id">) {
    try {
      setIsLoadingProjects(true);
      const db = await Database.load("sqlite:ANTTPublisher.db");

      await db.execute("INSERT INTO projects (name, filesFrom, filesTo) VALUES ($1, $2, $3)", [
        project.name,
        project.filesFrom,
        project.filesTo
      ]);

      getProjects().then(() => setIsLoadingProjects(false));
    } catch (error) {
      console.log(error);
      setError("Falha ao inserir projeto");
    }
  }

  useEffect(()=>{
    getProjects();
  }, []);

  return (
    <main className="container">
      <h1>Welcome to Tauri + SQLite</h1>

      {isLoadingProjects ? (
        <div>Carregando projetos...</div>
      ) : (
        <div className="collumns">
          <form
            className="row"
            onSubmit={(e) => {
              e.preventDefault();
              setProject({ name, filesFrom, filesTo });
              getProjects();
            }}
          >
            <div className="collumns">
              <input
                id="name-input"
                onChange={(e) => setName(e.currentTarget.value)}
                placeholder="Digite o nome..."
              />
              <input
                id="filesFrom-input"
                onChange={(e) => setFilesFrom(e.currentTarget.value)}
                placeholder="Digite a origem dos arquivos..."
              />
              <input
                id="filesTo-input"
                onChange={(e) => setFilesTo(e.currentTarget.value)}
                placeholder="Digite o destino dos arquivos..."
              />
              <button type="submit">Adicionar Projeto</button>
            </div>
          </form>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <h1>Projetos</h1>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Origem dos Arquivos</th>
                  <th>Destino dos Arquivos</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.id}</td>
                    <td>{project.name}</td>
                    <td>{project.filesFrom}</td>
                    <td>{project.filesTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {error && <p>{error}</p>}
    </main>
  );
}

export default App;
