export default function ModalActions({
  submitLabel,
  disabled,
  onSubmit,
}: {
  submitLabel: string;
  disabled?: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="mt-6 flex justify-end border-t pt-5">
      <button
        type="button"
        disabled={disabled}
        onClick={onSubmit}
        className="rounded-md bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitLabel}
      </button>
    </div>
  );
}