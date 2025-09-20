export default function IconButton({
  label,
  danger,
  onClick,
  children,
}: {
  label: string;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`rounded-md p-2 ${danger ? "text-red-600 hover:bg-red-50" : "text-indigo-700 hover:bg-indigo-50"}`}
    >
      {children}
    </button>
  );
}