export default function Loading() {
  return (
    <div className="min-h-screen bg-background py-24 px-6 max-w-6xl mx-auto animate-pulse">
      <div className="h-10 bg-muted rounded-md w-1/3 mb-4"></div>
      <div className="h-4 bg-muted rounded-md w-1/2 mb-12"></div>
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-64 bg-card border border-border rounded-2xl"></div>
        ))}
      </div>
    </div>
  );
}