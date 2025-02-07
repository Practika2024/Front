import React from 'react';
import CategoryTableRow from './CategoryTableRow';
import { useSelector } from 'react-redux';

const CategoriesTable = () => {
  const categoryList = useSelector((state) => state.category.categoryList);

  return (
    <table className="table table-striped table-bordered table-hover">
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {categoryList.map((category) => (
          <CategoryTableRow key={category.id} category={category} />
        ))}
      </tbody>
    </table>
  );
};

export default React.memo(CategoriesTable);
