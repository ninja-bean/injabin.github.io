import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-red border-4 border-ink flex items-center justify-center font-display font-black text-2xl text-white mb-6">
        404
      </div>
      <h1 className="font-display font-black text-4xl sm:text-6xl text-ink uppercase tracking-tight mb-4">
        Page Not Found
      </h1>
      <p className="font-body text-base text-ink/80 max-w-md mb-8">
        The requested Bauhaus coordinate does not exist. Form follows function—return to the main index.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-ink text-paper font-display font-bold text-sm uppercase tracking-wider border-2 border-ink hover:bg-blue hover:text-white transition-colors duration-150 ease-mechanical"
      >
        Return to Portfolio &rarr;
      </Link>
    </div>
  );
}
