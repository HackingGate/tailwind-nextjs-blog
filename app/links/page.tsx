import { Other, allOthers } from 'contentlayer/generated'
import OtherLayout from '@/layouts/OtherLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import { MDXLayoutRenderer } from 'pliny/mdx-components'

export const metadata = genPageMetadata({ title: 'Links' })

export default function Page() {
  const links = allOthers.find((p) => p.slug === 'links') as Other
  const mainContent = coreContent(links)

  return (
    <>
      <OtherLayout content={mainContent}>
        <MDXLayoutRenderer code={links.body.code} />
      </OtherLayout>
    </>
  )
}
