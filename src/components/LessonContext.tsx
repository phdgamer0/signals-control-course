import { createContext, useContext } from 'react'

export const LessonContext = createContext<{ moduleId: string }>({ moduleId: '00' })
export const useLesson = () => useContext(LessonContext)
