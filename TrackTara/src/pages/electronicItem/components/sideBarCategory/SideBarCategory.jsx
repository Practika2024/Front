import React, { memo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useActions from "../../../../hooks/useActions";
import { useSelector } from "react-redux";
import { selectMemoizedcategoryList } from "../../../../store/state/selectors/categorySelectors";

const SideBarCategory = memo(() => {
  const { getCategories } = useActions();
  const categoryList = useSelector(selectMemoizedcategoryList);
  const navigate = useNavigate();
  const { categoryId } = useParams();

  useEffect(() => {
    getCategories();
  }, []);

  const handleCategoryClick = (categoryClickId) => {
    if (categoryClickId !== categoryId) {
      navigate(`/electronicItem/${categoryClickId}`);
    }
  };

  const handleShowAllProducts = () => {
    navigate("/electronicItem");
  };

  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-center">
        <div className="bg-light border p-3" style={{ width: "250px" }}>
          <div className="mb-3">
            <button
              className="btn btn-primary w-100"
              onClick={handleShowAllProducts}
              disabled={!categoryId}
            >
              Усі товари
            </button>
          </div>
          <ul className="list-group">
            {categoryList.length > 0 ? (
              categoryList.map((category) => (
                <li
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="list-group-item list-group-item-action"
                  style={{ cursor: "pointer" }}
                >
                  {category.name}
                </li>
              ))
            ) : (
              <li className="list-group-item">Категорії відсутні</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
});

export default SideBarCategory;
