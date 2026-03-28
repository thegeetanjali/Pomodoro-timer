export default function Button({ children, loading, variant = "primary", className = "", ...props }) {
  const base = "w-full font-semibold py-3 rounded-2xl text-base transition-all duration-150 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-200",
    outline: "border-2 border-rose-300 hover:bg-rose-50 text-rose-500",
    ghost: "text-gray-500 hover:text-gray-800 hover:bg-gray-100",
  };

  return (
    <button {...props} disabled={loading || props.disabled} className={`${base} ${variants[variant]} ${className}`}>
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
}
