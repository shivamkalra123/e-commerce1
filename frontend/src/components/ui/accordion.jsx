import React, { useState } from 'react'

export const Accordion = ({ children }) => {
  return <div className='space-y-2'>{children}</div>
}

export const AccordionItem = ({ children }) => {
  return <div className='border rounded-xl'>{children}</div>
}

export const AccordionTrigger = ({ children }) => {
  const [open, setOpen] = useState(false)

  return (
    <button
      onClick={() => setOpen(!open)}
      className='w-full text-left px-4 py-3 font-medium flex justify-between items-center'
    >
      {children}
      <span>{open ? '-' : '+'}</span>
    </button>
  )
}

export const AccordionContent = ({ children }) => {
  return (
    <div className='px-4 py-3 text-gray-600 border-t'>
      {children}
    </div>
  )
}
