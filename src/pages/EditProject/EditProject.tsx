import { useAppStateStore } from "../../stores"

export default function EditProject(){
    const { modalProps } = useAppStateStore();
    return (<h1>teste {modalProps}</h1>);
}