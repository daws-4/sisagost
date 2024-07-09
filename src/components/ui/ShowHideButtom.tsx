'use client'
import { useState } from "react";
import Input from "./input_login";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function ({children, ...props}: Props){

    return (

        <button
          type="button"
          className="absolute inset-y-0 right-0 px-3 flex items-center"
          {...props}
        >
         {children}
        </button>
    );
}