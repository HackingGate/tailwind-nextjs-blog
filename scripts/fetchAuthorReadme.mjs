// Fetch the README.md file from the author's GitHub repository.
// And append the README.md file to data/authors/{author}.mdx

import { promises as fs } from 'fs'
import path from 'path'
import { Octokit } from '@octokit/rest'
import { allAuthors } from '../.contentlayer/generated/Authors/_index.mjs'
import fetch from "node-fetch";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const fetchAuthorReadme = async () => {
  const authors = allAuthors.filter((author) => author.github)
  for (const author of authors) {
    // TBD: Make the for loop continue even if one of the requests fails

    try {
      const { data } = await octokit.repos.getContent({
        owner: author.github,
        repo: author.github,
        path: 'README.md',
        request: {
          fetch: fetch
        },
      })

      const content = Buffer.from(data.content, 'base64').toString()
      // Rewrite the mdx file
      const mdx = `---
name: ${author.name}
avatar: ${author.avatar}
email: ${author.email}
github: ${author.github}
---
${content}
`
      const filepath = path.join(process.cwd(), 'data', 'authors', `${author.slug}.mdx`)
      await fs.writeFile(filepath, mdx)
    } catch (error) {
      console.log(error)
    }

  }
}

export default fetchAuthorReadme
