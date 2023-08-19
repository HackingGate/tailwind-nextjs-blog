import fetchAuthorReadme from './fetchAuthorReadme.mjs'

async function prebuild() {
  await fetchAuthorReadme()
}

prebuild()
