import { ToggleButton } from '@Components/ui/toogleButton';
import React from 'react';

interface StylesListProps<T> {
  items: T[];
  selectedItems: T[];
  onItemToggle: (item: T, isSelected: boolean) => void;
  getItemKey: (item: T) => string | number;
  renderItem: (item: T) => React.ReactNode;
}

export function StylesList<T>({ items, selectedItems, onItemToggle, getItemKey, renderItem }: StylesListProps<T>) {
  return (
    <ul className="flex flex-row flex-wrap gap-x-2 gap-y-3">
      {items.map((item) => (
        <li key={getItemKey(item)}>
          <ToggleButton selected={selectedItems.includes(item)} onSelect={(isSelected) => onItemToggle(item, isSelected)}>
            {renderItem(item)}
          </ToggleButton>
        </li>
      ))}
    </ul>
  );
}
