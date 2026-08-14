import { ComponentType, SVGProps } from "react";


interface ButtonProps {
    text: string;
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
    onClick?: () => void;
}

export function Button({Icon, onClick, text} : ButtonProps){
    return(
        <button
            onClick={onClick}
            className="w-full flex text-white bg-violet-600 rounded-lg text-center items-center justify-center gap-3 p-4 cursor-pointer hover:bg-violet-500 hover:scale-105 duration-200"
        >
            {text}
            <Icon />
        </button>
    )
}