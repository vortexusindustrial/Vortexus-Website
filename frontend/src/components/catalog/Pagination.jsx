function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null
  }

  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, start + 4)
  const pages = []

  for (let page = start; page <= end; page += 1) {
    pages.push(page)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="rounded-full border border-brand-border bg-white px-4 py-2 text-sm font-semibold text-brand-ink transition disabled:cursor-not-allowed disabled:opacity-45 hover:border-brand-green hover:text-brand-green"
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={[
            'rounded-full px-4 py-2 text-sm font-semibold transition',
            page === currentPage
              ? 'bg-brand-green text-white'
              : 'border border-brand-border bg-white text-brand-ink hover:border-brand-green hover:text-brand-green',
          ].join(' ')}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="rounded-full border border-brand-border bg-white px-4 py-2 text-sm font-semibold text-brand-ink transition disabled:cursor-not-allowed disabled:opacity-45 hover:border-brand-green hover:text-brand-green"
      >
        Next
      </button>
    </div>
  )
}

export default Pagination
