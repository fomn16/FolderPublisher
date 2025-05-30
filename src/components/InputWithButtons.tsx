import { Dispatch, RefObject } from "react"
import { IconType } from "react-icons"

export interface ButtonInfo{
    onClick?: () => void| Promise<void>
    icon: IconType
    ref?: RefObject<HTMLButtonElement>
}

interface Props{
    id: string,
    value:string,
    setValue?: Dispatch<string>
    placeholder:string,
    buttons: ButtonInfo[]
}

export default function InputWithButtons(props:Props){
    const {id, value, setValue, placeholder, buttons} = props
    return (
        <div style={{ position: 'relative', display: 'inline-block', width: '100%'}}>
            <input
            id={id + "-input"}
            type="text"
            value={value}
            placeholder={placeholder}
            readOnly={setValue?undefined:true}
            onChange={setValue?((e) => setValue(e.currentTarget.value)):undefined}
            style={{ paddingRight: '30px', }}
            />
            <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            height: '100%',
            display: 'flex'
            }}>
            {buttons.map((button, index) => {
                return(
                    <button
                        className="icon-button"
                        type="button"
                        id={id + "-" + index.toString()}
                        onClick={button.onClick}
                        style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        padding: '0 10px',
                        }}
                        ref={button.ref}
                        ><button.icon/></button>);
            })}
            </div>
        </div>
    );
}