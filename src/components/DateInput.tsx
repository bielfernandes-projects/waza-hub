'use client'

import { useRef } from 'react'
import { Calendar } from 'lucide-react'

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function DateInput({ label, id, className, ...props }: DateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleIconClick = () => {
    if (inputRef.current) {
      // Modern browsers support showPicker() on input elements
      try {
        inputRef.current.showPicker()
      } catch (error) {
        // Fallback for older browsers
        inputRef.current.focus()
      }
    }
  }

  return (
    <div className="flex flex-col">
      <label className="font-bold text-sm uppercase mb-1" htmlFor={id}>{label}</label>
      <div className="relative group">
        <input
          ref={inputRef}
          id={id}
          className={`w-full border-2 border-black p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black uppercase text-sm bg-white ${className || ''}`}
          style={{ 
            // Ensures standard browsers don't show the native picker automatically 
            // and allows manual typing
            appearance: 'none'
          }}
          {...props}
        />
        <button
          type="button"
          onClick={handleIconClick}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 transition-colors border-l border-transparent group-hover:border-neutral-200"
          title="Abrir calendário"
        >
          <Calendar size={18} className="text-black" />
        </button>
      </div>
      <style jsx global>{`
        /* Hide native calendar icon in Chrome/Edge/Safari */
        input::-webkit-calendar-picker-indicator {
          display: none !important;
          -webkit-appearance: none;
        }
        /* Mobile styling fix */
        input[type="date"]::-webkit-inner-spin-button,
        input[type="date"]::-webkit-calendar-picker-indicator {
            display: none;
            -webkit-appearance: none;
        }
      `}</style>
    </div>
  )
}
