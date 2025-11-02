export default function NotFound() {
  return (
    <div className="py-24 text-center space-y-4">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-muted-foreground">The page you’re looking for doesn’t exist.</p>
      <a href="/" className="underline">Go back home</a>
    </div>
  )
}
