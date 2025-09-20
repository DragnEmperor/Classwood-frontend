import Modal from "@/app/_components/modal";
import type { ParsedCsvError } from "@/lib/csv-errors";

export default function CsvErrorModal({
  error,
  onClose,
}: {
  error: ParsedCsvError;
  onClose: () => void;
}) {
  return (
    <Modal title={error.title} onClose={onClose}>
      <div className="space-y-4">
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-semibold">{error.message}</p>
          {typeof error.created === "number" ? (
            <p className="mt-1 text-red-700">
              {error.created} row{error.created === 1 ? "" : "s"} imported before the error.
            </p>
          ) : null}
        </div>

        {error.errors.length ? (
          <div className="max-h-[420px] overflow-y-auto rounded-md border">
            <div className="grid grid-cols-[90px_1fr] bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
              <span>Row</span>
              <span>Error</span>
            </div>
            {error.errors.map((rowError, index) => (
              <div key={`${rowError.row ?? "file"}-${index}`} className="grid grid-cols-[90px_1fr] border-t px-4 py-3 text-sm">
                <span className="font-semibold text-slate-700">{rowError.row ?? "-"}</span>
                <div className="space-y-1 text-slate-700">
                  {rowError.errors.map((message, messageIndex) => (
                    <p key={`${message}-${messageIndex}`}>{message}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex justify-end border-t pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
