// import React from "react";
// import { Controller } from "react-hook-form";
// import TextField from "@mui/material/TextField";

// export default function MyTextField(props) {
//   const { label, name, control, rules = {}, type = "text" } = props;

//   return (
//     <Controller
//       name={name}
//       control={control}
//       rules={rules}
//       defaultValue=""
//       render={({ field, fieldState: { error } }) => (
//         <TextField
//           {...field}
//           type={type}
//           label={label}
//           variant="outlined"
//           className="myform"
//           fullWidth
//           margin="normal"
//           error={!!error}
//           helperText={error ? error.message : ""}
//         />
//       )}
//     />
//   );
// }


import React from "react";
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

export default function MyTextField(props) {
  const { label, name, control, rules = {}, type = "text" } = props;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue=""
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          type={type}
          label={label}
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!error}
          helperText={error ? error.message : ""}
        />
      )}
    />
  );
}