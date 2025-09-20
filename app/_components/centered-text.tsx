export default function CenteredText({ text, className = "" }: { text: string; className?: string }) {
  return <div className={`flex h-72 items-center justify-center text-gray-600 ${className}`}>{text}</div>;
}