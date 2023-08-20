import { promises as fs } from 'fs'
import path from 'path'

// Fill the path to your Jekyll repository
const jekyllRepositoryPath = ''

const migrateFromJekyll = async () => {
  const allPosts = await fs.readdir(path.join(jekyllRepositoryPath, '_posts'))

  let redirects = []

  // Convert all posts and save them to the data/blog folder
  for (const post of allPosts) {
    // Skip unsupported posts
    if (post === '2018-01-22-welcome-to-jekyll.markdown') {
      continue
    }

    const postPath = path.join(jekyllRepositoryPath, '_posts', post)
    const data = await fs.readFile(postPath, 'utf8')

    // Read form Jekyll frontmatter
    // Example:
    // ---
    // title: "Hello World"
    // date: 2020-01-01
    // tag: osx linux docker or categories: jekyll update
    // ---
    const title = data.match(/title: (.*)/)[1]
    const date = `'${post.match(/^\d{4}-\d{2}-\d{2}/)[0]}'`
    let tag = ''
    let tagMatch = data.match(/tag: (.*)/)
    if (tagMatch) {
      tag = tagMatch[1]
    } else {
      tagMatch = data.match(/categories: (.*)/)
      if (tagMatch) {
        tag = tagMatch[1]
      }
    }
    // convert tag to array
    const tags = `[${tag
      .split(' ')
      .map((t) => `${t}`)
      .join(', ')}]`

    // Remove YYYY-MM-DD- from the filename and replace extension with .mdx
    const filename = post.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.[^/.]+$/, '.mdx')

    const cleanData = data.replace(/---\n(.|\n)*---\n/, '')

    const compatibleData = removeUnsupportedFeatures(cleanData)

    const mdx = `---
title: ${title}
date: ${date}
tags: ${tags}
---
${compatibleData}
`
    // Remove empty lines between frontmatter and content
    const cleanMDX = mdx.replace(/---\n\n/, '---\n')
    console.log(cleanMDX)

    // Save it to the data/blog folder
    const filepath = path.join(process.cwd(), 'data', 'blog', `${filename}`)
    console.log(filepath)
    // Save the content to the file
    await fs.writeFile(filepath, mdx)

    // Append redirects to next.config.js since I moved from Jekyll to Next.js
    // Example:
    // module.exports = {
    //   async redirects() {
    //     return [
    //       {
    //         source: '/2021/08/15/network-layer-ip-address-blocking.html',
    //         destination: '/blog/network-layer-ip-address-blocking', // Matched parameters can be used in the destination
    //         permanent: true,
    //       },
    //     ]
    //   },
    // }

    // Replace 'YYYY-MM-DD' with YYYY/MM/DD in the URL
    const dateInURL = date.replace(/'/g, '').replace(/-/g, '/')
    const redirect = `{
        source: '/${dateInURL}/${filename.replace(/\.mdx$/, '.html')}',
        destination: '/blog/${filename.replace(/\.mdx$/, '')}',
        permanent: true,
      }`
    redirects.push(redirect)
  }

  console.log('Copy the following to next.config.js')
  const redirectsString = redirects.join(',\n      ')

  console.log(`module.exports = {
  async redirects() {
    return [
      ${redirectsString}
    ]
  },
}`)
}

const removeUnsupportedFeatures = (content) => {
  let contentToReturn = content

  // Remove {:target="_blank"}
  const regex = /{:target="_blank"}/g
  contentToReturn = contentToReturn.replace(regex, '')

  return contentToReturn
}

export default migrateFromJekyll
