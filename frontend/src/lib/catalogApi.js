let catalogPromise
let summaryPromise

export async function loadCatalog() {
  if (!catalogPromise) {
    catalogPromise = fetch('/catalog/stock-products.json').then((response) => {
      if (!response.ok) {
        throw new Error('Failed to load product catalog.')
      }
      return response.json()
    })
  }

  return catalogPromise
}

export async function loadCatalogSummary() {
  if (!summaryPromise) {
    summaryPromise = fetch('/catalog/catalog-summary.json').then((response) => {
      if (!response.ok) {
        throw new Error('Failed to load catalog summary.')
      }
      return response.json()
    })
  }

  return summaryPromise
}

export function filterProductsByCategory(products, categorySlug) {
  return products.filter((product) => product.categorySlug === categorySlug)
}

export function filterProductsByIndustry(products, industrySlug) {
  return products.filter((product) => product.industrySlugs.includes(industrySlug))
}

export function findProductBySlug(products, productSlug) {
  return products.find((product) => product.slug === productSlug) || null
}

export function getRelatedCatalogProducts(products, product, limit = 4) {
  return products
    .filter(
      (candidate) =>
        candidate.slug !== product.slug &&
        (candidate.categorySlug === product.categorySlug ||
          candidate.subcategory === product.subcategory ||
          candidate.industrySlugs.some((slug) => product.industrySlugs.includes(slug))),
    )
    .slice(0, limit)
}
