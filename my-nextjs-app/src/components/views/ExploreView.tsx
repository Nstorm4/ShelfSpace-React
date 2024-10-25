import { ExploreView as OriginalExploreView }  from "@/components/explore-view";

export default function ExploreView() {
  return (
    <>
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-6 text-center">Explore Books based on your interests</h1>
        <p className="text-xl mb-8 text-center text-foreground-muted">
          Discover your next favorite book.
        </p>
      </div>
      < OriginalExploreView />
      <div>
      </div>
    </>
  );
}