import { useEffect, useState } from 'react'
import {
  addComparedSlug,
  clearComparedSlugs,
  isCompared,
  loadComparedSlugs,
  removeComparedSlug,
  subscribeToCompareChanges,
  toggleComparedSlug,
} from '../lib/compareStore'

function useProductCompare() {
  const [comparedSlugs, setComparedSlugs] = useState([])

  useEffect(() => {
    setComparedSlugs(loadComparedSlugs())
    return subscribeToCompareChanges(setComparedSlugs)
  }, [])

  return {
    comparedSlugs,
    comparedCount: comparedSlugs.length,
    isCompared,
    addComparedSlug,
    removeComparedSlug,
    toggleComparedSlug,
    clearComparedSlugs,
  }
}

export default useProductCompare
