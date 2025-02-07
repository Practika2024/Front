import React from 'react';

const CategoryTableRow = ({ category }) => {
  return (
    <tr>
      <td>{category.id}</td>
      <td>{category.name}</td>
    </tr>
  );
};

export default React.memo(CategoryTableRow);
