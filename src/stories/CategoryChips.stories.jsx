import React from 'react';
import CategoryChips from '../components/CategoryChips';

export default {
  title: 'Components/CategoryChips',
  component: CategoryChips,
  parameters: {
    layout: 'padded',
  },
};

const sampleCategories = ['react', 'redux', 'vite', 'javascript', 'testing'];

export function AllSelected() {
  return (
    <CategoryChips
      categories={sampleCategories}
      selectedCategory=""
      onSelectCategory={() => {}}
    />
  );
}

export function SpecificCategorySelected() {
  return (
    <CategoryChips
      categories={sampleCategories}
      selectedCategory="react"
      onSelectCategory={() => {}}
    />
  );
}
