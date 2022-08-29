import React from "react"

const SugarCubeIcon = (props: { classes: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 48 48"
      className={props.classes}
    >
      <g transform="translate(0 -1004.4)">
        <g transform="translate(-6 1003)">
          <path fill="#f9f9f9" d="M30 2.362l-20 10 20 10 20-10z"></path>
          <path fill="#ececec" d="M30 22.362v25l20-10v-25z"></path>
          <path fill="#ccc" d="M30 22.362v25l-20-10v-25z"></path>
          <path
            fill="none"
            stroke="#4d4d4d"
            strokeWidth="1"
            d="M30 2.375l-20 10v25l20 10 20-10v-25l-20-10z"
          ></path>
        </g>
      </g>
    </svg>
  )
}

export default SugarCubeIcon
