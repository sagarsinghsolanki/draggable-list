import type { Item } from "../types";

export const findItemById = (items: Item[], id: string): Item | null => {
  for (const item of items) {
    if (item.id === id) return item;
    const found = findItemById(item.children, id);
    if (found) return found;
  }
  return null;
};

export const findItemPath = (items: Item[], targetId: string, path: number[] = []): number[] | null => {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const currentPath = [...path, i];
    
    if (item.id === targetId) {
      return currentPath;
    }
    
    const foundPath = findItemPath(item.children, targetId, currentPath);
    if (foundPath) return foundPath;
  }
  return null;
};

export const removeItemByPath = (items: Item[], path: number[]): Item[] => {
  if (path.length === 0) return items;
  
  const newItems = [...items];
  if (path.length === 1) {
    newItems.splice(path[0], 1);
    return newItems;
  }
  
  const [first, ...rest] = path;
  newItems[first] = {
    ...newItems[first],
    children: removeItemByPath(newItems[first].children, rest)
  };
  
  return newItems;
};

export const insertItemAtPath = (items: Item[], path: number[], item: Item): Item[] => {
  if (path.length === 0) return [...items, item];
  
  const newItems = [...items];
  if (path.length === 1) {
    newItems.splice(path[0], 0, item);
    return newItems;
  }
  
  const [first, ...rest] = path;
  if (first >= newItems.length) {
    return [...newItems, { ...item, children: [] }];
  }
  
  newItems[first] = {
    ...newItems[first],
    children: insertItemAtPath(newItems[first].children, rest, item)
  };
  
  return newItems;
};

export const addChildToItem = (items: Item[], parentId: string, child: Item): Item[] => {
  return items.map(item => {
    if (item.id === parentId) {
      return {
        ...item,
        children: [...item.children, child]
      };
    }
    return {
      ...item,
      children: addChildToItem(item.children, parentId, child)
    };
  });
};

export const isDescendant = (items: Item[], ancestorId: string, descendantId: string): boolean => {
  const ancestor = findItemById(items, ancestorId);
  if (!ancestor) return false;
  
  const checkDescendants = (children: Item[]): boolean => {
    for (const child of children) {
      if (child.id === descendantId) return true;
      if (checkDescendants(child.children)) return true;
    }
    return false;
  };
  
  return checkDescendants(ancestor.children);
};