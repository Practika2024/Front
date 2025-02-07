import { TextField } from "@mui/material";
import React, { memo } from "react";

const TextBox = memo(({ value, onChange, name, label }) => {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      fullWidth
    />
  );
});

export default TextBox;
