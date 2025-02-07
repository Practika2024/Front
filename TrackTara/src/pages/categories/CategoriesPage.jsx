import React from 'react';
import CategoryTableContainer from './components/CategoryTableContainer';

const CategoriesPage = () => {
  return (
    <div className="container my-3">
      <h1>Categories</h1>
      <CategoryTableContainer />
    </div>
  );
};

export default CategoriesPage;
