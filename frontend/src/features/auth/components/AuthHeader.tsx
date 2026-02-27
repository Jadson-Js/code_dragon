interface AuthHeaderProps {
  title: string;
  description: string;
  centered?: boolean;
}

export default function AuthHeader({
  title,
  description,
  centered = false,
}: AuthHeaderProps) {
  return (
    <header
      className={`flex flex-col gap-2 mb-8 ${centered ? "text-center" : ""}`}
    >
      <h1 className="text-h1 text-white-1">{title}</h1>
      <p className="text-white-2">{description}</p>
    </header>
  );
}
