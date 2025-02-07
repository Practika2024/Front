import React, { useEffect } from 'react';
import useActions from '../../../hooks/useActions';
import CategoriesTable from './CategoriesTable';

const CategoryTableContainer = () => {
  const { getCategories } = useActions();

  useEffect(() => {
    getCategories();
  }, []);

  return <CategoriesTable />;
};

export default CategoryTableContainer;
