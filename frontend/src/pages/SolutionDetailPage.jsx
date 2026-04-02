import { Navigate, useParams } from 'react-router-dom'
import Seo from '../components/seo/Seo'
import SolutionDetailPageContent from '../components/solutions/SolutionDetailPageContent'
import { getSolutionBySlug } from '../data/solutionsCatalog'

function SolutionDetailPage() {
  const { slug } = useParams()
  const solution = getSolutionBySlug(slug)

  if (!solution) {
    return <Navigate to="/solutions" replace />
  }

  return (
    <>
      <Seo title={solution.title} description={solution.description || solution.summary} />
      <SolutionDetailPageContent solution={solution} />
    </>
  )
}

export default SolutionDetailPage
