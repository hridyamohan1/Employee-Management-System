// import React, { useState } from "react";
// import { Controller } from "react-hook-form";
// import TextField from "@mui/material/TextField";
// import InputAdornment from "@mui/material/InputAdornment";
// import IconButton from "@mui/material/IconButton";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";

// export default function MyPassField(props) {
//   const { label, name, control, rules = {} } = props;
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <Controller
//       name={name}
//       control={control}
//       rules={rules}
//       defaultValue=""
//       render={({ field, fieldState: { error } }) => (
//         <TextField
//           {...field}
//           label={label}
//           type={showPassword ? "text" : "password"}
//           variant="outlined"
//           className="myform"
//           fullWidth
//           margin="normal"
//           error={!!error}
//           helperText={error ? error.message : ""}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton
//                   onClick={() => setShowPassword((prev) => !prev)}
//                   edge="end"
//                 >
//                   {showPassword ? <VisibilityOff /> : <Visibility />}
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />
//       )}
//     />
//   );
// }


import React, { useState } from "react";
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function MyPassField(props) {
  const { label, name, control, rules = {} } = props;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue=""
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!error}
          helperText={error ? error.message : ""}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}