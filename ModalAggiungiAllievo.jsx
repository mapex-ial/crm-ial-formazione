export function Loader({ className = "w-6 h-6" }) {
  return (
    <div className={`${className} animate-spin rounded-full border-2 border-white/30 border-t-white`}></div>
  );
}
