import React from "react";
import FilterSideBarElectronicItemContainer from "./containers/FilterSideBarElectronicItemContainer";
import ProductListContainer from "./containers/ProductListContainer";
import SideBarCategoryContainer from "./containers/SideBarCategoryContainer";

const ElectronicItemPage = () => {
  console.log("ElectronicItemPage");

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <SideBarCategoryContainer />
        </div>
        <div className="col-md-6">
          <ProductListContainer />
        </div>
        <div className="col-md-3">
          <FilterSideBarElectronicItemContainer />
        </div>
      </div>
    </div>
  );
};

export default ElectronicItemPage;
