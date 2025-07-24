import React from 'react';
import { useDragDrop } from './DragDropProvider';
import type { Item } from '../types';

interface ListItemProps {
  item: Item;
  level: number;
  index: number;
  onMove: (draggedId: string, targetId: string | null, position: 'above' | 'below' | 'inside') => void;
  allItems: Item[];
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
}

export const ListItems: React.FC<ListItemProps> = ({
  item,
  level,
  onMove,
  allItems,
  isExpanded,
  onToggleExpand,
}) => {
  const { dragState, setDragState } = useDragDrop();
  const hasChildren = item.children?.length > 0;

  const isDragging = dragState.draggedItem?.id === item.id;
  const isDragOver = dragState.dragOverItem === item.id;

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    setDragState({
      draggedItem: item,
      draggedPath: [],
      dragOverItem: null,
      dropPosition: null,
    });
  };

  const handleDragEnd = () => {
    setDragState({
      draggedItem: null,
      draggedPath: [],
      dragOverItem: null,
      dropPosition: null,
    });
  };

  const handleDragOver = (e: React.DragEvent, position: 'above' | 'below' | 'inside') => {
    e.preventDefault();
    e.stopPropagation();
    setDragState((prev) => ({
      ...prev,
      dragOverItem: item.id,
      dropPosition: position,
    }));
  };

  const handleDrop = (position: 'above' | 'below' | 'inside') => {
    if (!dragState.draggedItem || dragState.draggedItem.id === item.id) return;

    const draggedId = dragState.draggedItem.id;
    const targetId = item.id;

    const isSelfDrop =
      draggedId === targetId ||
      (position === 'inside' && isDescendant(allItems, draggedId, targetId));

    if (isSelfDrop) return;

    onMove(draggedId, targetId, position);

    setDragState({
      draggedItem: null,
      draggedPath: [],
      dragOverItem: null,
      dropPosition: null,
    });
  };

  const isDescendant = (tree: Item[], parentId: string, targetId: string): boolean => {
    const parent = tree.find((i) => i.id === parentId);
    if (!parent || !parent.children) return false;

    const check = (children: Item[]): boolean => {
      for (const child of children) {
        if (child.id === targetId) return true;
        if (child.children && check(child.children)) return true;
      }
      return false;
    };

    return check(parent.children);
  };

  return (
    <div style={{ paddingLeft: level * 20 }}>
      <div
        style={{
          height: '4px',
          backgroundColor: isDragOver && dragState.dropPosition === 'above' ? 'lightblue' : 'transparent',
        }}
        onDragOver={(e) => handleDragOver(e, 'above')}
        onDrop={() => handleDrop('above')}
      />
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => handleDragOver(e, 'inside')}
        onDrop={() => handleDrop('inside')}
        style={{
          border: isDragOver && dragState.dropPosition === 'inside' ? '1px dashed blue' : '1px solid #ddd',
          backgroundColor: isDragging ? '#eee' : '#fff',
          padding: '6px 10px',
          margin: '4px 0',
          display: 'flex',
          gap: '6px',
        }}
      >
        <span
          onClick={() => onToggleExpand(item.id)}
          style={{ cursor: hasChildren ? 'pointer' : 'default' }}
        >
          {hasChildren ? (isExpanded ? '📂' : '📁') : '📄'}
        </span>
        <span>{item.content}</span>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {item.children.map((child, idx) => (
            <ListItems
              key={child.id}
              item={child}
              level={level + 1}
              index={idx}
              onMove={onMove}
              allItems={allItems}
              isExpanded={isExpanded}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
      <div
        style={{
          height: '4px',
          backgroundColor: isDragOver && dragState.dropPosition === 'below' ? 'lightblue' : 'transparent',
        }}
        onDragOver={(e) => handleDragOver(e, 'below')}
        onDrop={() => handleDrop('below')}
      />
    </div>
  );
};
