import React from "react";

interface IProps {
  title: string;
  text: string;
  className?: string;
}

export default function AuthHeader({ title, text, className }: IProps) {
  return (
    <header className={className}>
      <h2 className="typ-h1 text-white-1">{title}</h2>
      <p className="text-white-2">{text}</p>
    </header>
  );
}
