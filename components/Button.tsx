// components/Button.tsx
"use client";
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  color?: "blue" | "red" | "green";
}
export default function Button({
  children,
  onClick,
  color = "blue",
}: ButtonProps) {
  const bg =
    color === "blue"
      ? "bg-blue-600 hover:bg-blue-700"
      : color === "red"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-green-600 hover:bg-green-700";
  return (
    <button onClick={onClick} className={`${bg} text-white px-3 py-1 rounded`}>
      {children}
    </button>
  );
}
