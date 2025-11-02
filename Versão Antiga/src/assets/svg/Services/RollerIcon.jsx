import * as React from "react";

function SvgComponent(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={35.459} height={43.42} {...props}>
      {/* Borda preta */}
      <circle cx="32" cy="32" r="30" fill="#4f4f4f" stroke="#000" strokeWidth="2" />
      
      {/* Crateras com tons de cinza claro */}
      <g fill="#6b6b6b">
        <circle cx="20" cy="24" r="4" />
        <circle cx="40" cy="18" r="3" />
        <circle cx="45" cy="35" r="5" />
        <circle cx="25" cy="45" r="6" />
        <circle cx="38" cy="48" r="3" />
        <circle cx="30" cy="32" r="4" />
      </g>
    </svg>
  );
}

export default SvgComponent;