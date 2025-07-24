import React, { createContext, useContext, useState } from 'react';
import type { DragState } from '../types';

interface DragDropContextType {
  dragState: DragState;
  setDragState: React.Dispatch<React.SetStateAction<DragState>>;
}

const DragDropContext = createContext<DragDropContextType | null>(null);

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within DragDropProvider');
  }
  return context;
};

interface DragDropProviderProps {
  children: React.ReactNode;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({ children }) => {
  const [dragState, setDragState] = useState<DragState>({
    draggedItem: null,
    draggedPath: [],
    dragOverItem: null,
    dropPosition: null,
  });
  console.log("dragState", dragState)

  return (
    <DragDropContext.Provider value={{ dragState, setDragState }}>
      {children}
    </DragDropContext.Provider>
  );
};