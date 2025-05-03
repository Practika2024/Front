import React, { memo } from "react";

const ImageItem = ({ image, onRemove }) => {
  return (
    <div className="position-relative">
      <button
        type="button"
        className="btn-close position-absolute top-0 end-0 bg-danger p-2"
        aria-label="Close"
        onClick={() => onRemove(image.id)}
      />
      <img
        height="200"
        width="200"
        alt="Product"
        src={image.filePath}
        className="border rounded"
      />
    </div>
  );
};


export default memo(ImageItem);
