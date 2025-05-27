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