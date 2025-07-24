export interface Item {
  id: string;
  content: string;
  children: Item[];
}

export interface DragState {
  draggedItem: Item | null;
  draggedPath: number[];
  dragOverItem: string | null;
  dropPosition: 'above' | 'below' | 'inside' | null;
}