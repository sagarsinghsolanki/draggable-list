import { useState } from 'react';
import { DragDropProvider } from './DragDropProvider';
import { ListItems } from './ListItems';
import type { Item } from '../types';
import {
  findItemById,
  findItemPath,
  insertItemAtPath,
  removeItemByPath,
  addChildToItem,
} from '../utils/treeUtils';

export const List = ({ items, onItemsChange }: { items: Item[]; onItemsChange: (items: Item[]) => void }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isDescendant = (tree: Item[], parentId: string, targetId: string): boolean => {
    const parent = findItemById(tree, parentId);
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

  const handleMove = (
    draggedId: string,
    targetId: string | null,
    position: 'above' | 'below' | 'inside'
  ) => {
    const draggedPath = findItemPath(items, draggedId);
    const draggedItem = findItemById(items, draggedId);
    if (!draggedPath || !draggedItem) return;

    if (targetId && isDescendant(items, draggedId, targetId)) return;

    let newItems = removeItemByPath(items, draggedPath);

    if (position === 'inside' && targetId) {
      newItems = addChildToItem(newItems, targetId, draggedItem);
      setExpandedItems((prev) => [...new Set([...prev, targetId])]);
    } else if (targetId) {
      const targetPath = findItemPath(newItems, targetId);
      if (targetPath) {
        const insertIndex =
          position === 'above'
            ? targetPath[targetPath.length - 1]
            : targetPath[targetPath.length - 1] + 1;
        const insertPath = [...targetPath.slice(0, -1), insertIndex];
        newItems = insertItemAtPath(newItems, insertPath, draggedItem);
      }
    }

    onItemsChange(newItems);
  };

  return (
    <DragDropProvider>
      <div>
        {items.map((item, index) => (
          <ListItems
            key={item.id}
            item={item}
            level={0}
            index={index}
            onMove={handleMove}
            allItems={items}
            isExpanded={expandedItems.includes(item.id)}
            onToggleExpand={toggleExpand}
          />
        ))}
      </div>
    </DragDropProvider>
  );
};
