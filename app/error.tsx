'use client'
export default function GlobalError({ error }: { error: Error }) {
  console.error(error)
  return (
    <html>
      <body className="p-6">
        <h2>Something went wrong</h2>
        <p className="text-sm text-neutral-500">{error.message}</p>
      </body>
    </html>
  )
}
