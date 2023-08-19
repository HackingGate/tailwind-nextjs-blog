import rss from './rss.mjs'
import fetchAuthorReadme from "./fetchAuthorReadme.mjs";

async function postbuild() {
  await fetchAuthorReadme()
  await rss()
}

postbuild()
