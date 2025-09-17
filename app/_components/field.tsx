export default function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block font-semibold text-gray-800">{label}</span>
      {children}
    </label>
  );
}