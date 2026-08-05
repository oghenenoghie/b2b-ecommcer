export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-bone">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="label mb-4">Aswaq</p>
        <p className="max-w-md text-sm text-smoke">
          A B2B marketplace for wholesale and industrial procurement — sourced by
          language, not category trees.
        </p>
        <p className="mt-8 font-mono text-xs tabular-nums text-ash">
          &copy; {new Date().getFullYear()} Aswaq
        </p>
      </div>
    </footer>
  );
}
