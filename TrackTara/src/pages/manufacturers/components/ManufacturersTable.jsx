import React from "react";
import ManufacturerTableRow from "./ManufacturerTableRow";
import { useSelector } from "react-redux";
import { useRenderCount } from "../../../hooks/useRenderCount";

const ManufacturersTable = () => {
  const manufacturerList = useSelector(
    (state) => state.manufacturer.manufacturerList
  );

  const renderCount = useRenderCount();

  return (
    <>
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Categories</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {manufacturerList.map((manufacturer) => (
            <ManufacturerTableRow
              key={manufacturer.id}
              manufacturer={manufacturer}
            />
          ))}
        </tbody>
      </table>
      <h5>ManufacturersTable render count: {renderCount}</h5>
    </>
  );
};

export default React.memo(ManufacturersTable);
