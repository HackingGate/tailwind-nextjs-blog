import { promises as fs } from 'fs'
import path from 'path'
import axios from 'axios'

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

    const imageConvertedData = await replaceImages(cleanData)

    const compatibleData = removeUnsupportedFeatures(imageConvertedData)

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

const replaceImages = async (content) => {
  // If image is hosted somewhere else, download it and save it to the public/static folder
  // Replace markdown image with the new path
  // Example:
  // ![cookies](https://i.imgur.com/LE0YpNo.png)
  // ![cookies](/static/images/cookies.png)

  // If image is hosted on the same server, just replace the path
  // Example:
  // ![image](/images/NextDNS-Default-Configuration-Privacy.png)
  // ![image](/static/images/NextDNS-Default-Configuration-Privacy.png)

  // Regular expression to match markdown image syntax
  const imageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s]+)?(\/[^\s]+)?\)/g;
  let contentToReturn = content;

  let match;
  while (match = imageRegex.exec(content)) {
    const altText = match[1];
    const externalUrl = match[2];
    const localPath = match[3];

    if (externalUrl) {
      // Download and save the external image
      try {
        const response = await axios.get(externalUrl, { responseType: 'arraybuffer' });
        const filename = path.basename(new URL(externalUrl).pathname);
        // Create new filename of the form altText.extension
        const newFilename = `${altText}.${filename.split('.').pop()}`;
        const localFilePath = path.join('public', 'static', 'images', newFilename);

        await fs.writeFile(localFilePath, response.data);

        // Replace in content
        const newImageMarkdown = `![${altText}](/static/images/${newFilename})`;
        contentToReturn = contentToReturn.replace(match[0], newImageMarkdown);
      } catch (error) {
        console.error(`Error downloading image ${externalUrl}:`, error.message);
      }
    } else if (localPath) {
      // Copy the image to the ${PWD}/static/ folder
      await fs.cp(path.join(jekyllRepositoryPath, localPath), path.join('public', 'static', localPath));

      // Modify the local path
      const newLocalPath = localPath.replace('/images/', '/static/images/');
      const newImageMarkdown = `![${altText}](${newLocalPath})`;
      contentToReturn = contentToReturn.replace(match[0], newImageMarkdown);
    }
  }

  return contentToReturn
}

export default migrateFromJekyll
