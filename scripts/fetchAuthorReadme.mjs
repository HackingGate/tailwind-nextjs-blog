// Fetch the README.md file from the author's GitHub repository.
// And append the README.md file to data/authors/{author}.mdx

import { promises as fs } from 'fs'
import path from 'path'
import { Octokit } from '@octokit/rest'
import { allAuthors } from '../.contentlayer/generated/Authors/_index.mjs'
import fetch from 'node-fetch'

const octokit = new Octokit()

const fetchAuthorReadme = async () => {
  const authors = allAuthors.filter((author) => author.github)
  for (const author of authors) {
    // TBD: Make the for loop continue even if one of the requests fails

    // Get GitHub username from GitHub URL
    const githubUsername = author.github.split('/').pop()

    try {
      const { data } = await octokit.repos.getContent({
        owner: githubUsername,
        repo: githubUsername,
        path: 'README.md',
        request: {
          fetch: fetch,
        },
      })

      // Fetch avatar from GitHub
      const avatar = await octokit.users.getByUsername({
        username: githubUsername,
        request: {
          fetch: fetch,
        },
      })
      const avatarData = await fetch(avatar.data.avatar_url)
      // Overwrite avatar to the path of author.avatar
      await fs.writeFile(
        path.join(process.cwd(), 'public', author.avatar),
        await avatarData.buffer()
      )

      // TBD: Make the MDX fully compatible with GitHub Flavored Markdown
      // Workaround: Remove unsupported features
      let content = Buffer.from(data.content, 'base64').toString()
      content = removeUnsupportedFeatures(content)

      // Rewrite the mdx file
      const mdx = `---
name: ${author.name}
avatar: ${author.avatar}
email: ${author.email}
github: ${author.github}
type: Authors
---
${content}
[See full README.md](${data.html_url})  
`

      const filepath = path.join(process.cwd(), 'data', 'authors', `${author.slug}.md`)
      await fs.writeFile(filepath, mdx)
    } catch (error) {
      console.log(error)
    }
  }
}

const removeUnsupportedFeatures = (content) => {
  let contentToReturn = content

  // Remove HTML comments
  const regex = /<!--[\s\S]*?-->/g
  contentToReturn = contentToReturn.replace(regex, '')

  // Remove badges
  const regex2 = /\[!\[.*\]\(.*\)\]\(.*\)/g
  contentToReturn = contentToReturn.replace(regex2, '')

  // Remove HTML tags
  const regex3 = /<[^>]*>/g
  contentToReturn = contentToReturn.replace(regex3, '')

  // Remove empty lines
  const regex4 = /^\s*[\r\n]/gm
  contentToReturn = contentToReturn.replace(regex4, '')

  return contentToReturn
}

export default fetchAuthorReadme
