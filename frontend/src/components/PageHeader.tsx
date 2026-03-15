interface IProps {
  title: string;
  description: string;
  className?: string;
  type?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export default function PageHeader({
  title,
  description,
  className,
  type = "h1",
}: IProps) {
  return (
    <header className={className}>
      <h2 className={`typ-${type} text-white-1 mb-1`}>{title}</h2>
      <p className="text-white-2">{description}</p>
    </header>
  );
}
