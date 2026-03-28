export default function Input({ label, error, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      )}
      <input
        {...props}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all
          focus:ring-2 focus:ring-rose-300 focus:border-rose-400
          ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}
          ${props.className || ""}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
