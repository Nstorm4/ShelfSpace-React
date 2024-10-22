import { SearchView as OriginalSearchView } from "@/components/search-view";

export default function SearchView() {
  return (
    <>
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-6 text-center">Book Search</h1>
        <p className="text-xl mb-8 text-center text-foreground-muted">
          Discover your next favorite book.
        </p>
      </div>
      <div>
        <OriginalSearchView />
      </div>
    </>
  );
}
