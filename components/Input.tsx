/* eslint-disable @typescript-eslint/no-empty-object-type */
// components/Input.tsx
"use client";
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export default function Input(props: InputProps) {
  return <input className="border rounded p-2 w-full" {...props} />;
}
