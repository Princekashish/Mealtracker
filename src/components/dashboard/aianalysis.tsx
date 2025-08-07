import { Bot, X } from 'lucide-react'
import React from 'react'

interface aitoggle {
    onClose: () => void;
    isHiding?: boolean;
}

function Aianalysis({ onClose, isHiding }: aitoggle) {
    return (
        <div className={`relative border rounded-xl flex md:justify-center md:gap-4  justify-between p-3 items-center transition-all duration-300 ease-in-out 
            ${isHiding ? "opacity-0 translate-y-0" : "opacity-100 translate-y-2"}`}>
            <X onClick={onClose} size={19} className='absolute top-2 right-2 font-bold ' />
            <Bot size={25} className=' w-6 h-6' />
            <h1 className='text-sm flex-wrap  w-[85%]  md:w-full md:text-base'>Not enough data for a spending analysis. Keep logging your meals!</h1>
        </div>
    )
}

export default Aianalysis