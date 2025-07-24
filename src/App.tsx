import { useState } from 'react';
import type { Item } from './types';
import { List } from './components/List';

const initialData: Item[] = [
  {
    id: 'A',
    content: 'Group A',
    children: [
      { id: '1', content: 'Item 1', children: [] },
      { id: '2', content: 'Item 2', children: [] },
      { id: '3', content: 'Item 3', children: [] },
    ],
  },
  {
    id: 'B',
    content: 'Group B',
    children: [
      { id: '4', content: 'Item 4', children: [] },
      { id: '5', content: 'Item 5', children: [] },
    ],
  },
  {
    id: 'C',
    content: 'Group C',
    children: [
      { id: '6', content: 'Item 6', children: [] },
      { id: '7', content: 'Item 7', children: [] },
      { id: '8', content: 'Item 8', children: [] },
      { id: '9', content: 'Item 9', children: [] },
    ],
  },
  {
    id: 'D',
    content: 'Group D',
    children: [
      { id: '10', content: 'Item 10', children: [] },
      { id: '11', content: 'Item 11', children: [] },
      { id: '12', content: 'Item 12', children: [] },
    ],
  },
];

function App() {
  const [items, setItems] = useState<Item[]>(initialData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <List items={items} onItemsChange={setItems} />
        </div>
      </div>
    </div>
  );
}

export default App;