import Seo from '../components/seo/Seo'
import PageHero from '../components/sections/PageHero'
import PageSectionGrid from '../components/sections/PageSectionGrid'
import { pageContent } from '../data/pageContent'

function NewsPage() {
  const content = pageContent.news

  return (
    <>
      <Seo title="News" description={content.description} />
      <PageHero
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <PageSectionGrid items={content.items} />
    </>
  )
}

export default NewsPage
