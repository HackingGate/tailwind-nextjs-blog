const { withContentlayer } = require('next-contentlayer')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src *.s3.amazonaws.com;
  connect-src *;
  font-src 'self';
  frame-src giscus.app
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    reactStrictMode: true,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    eslint: {
      dirs: ['app', 'components', 'layouts', 'scripts'],
    },
    images: {
      domains: ['picsum.photos'],
    },
    experimental: {
      appDir: true,
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
      ]
    },
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })

      return config
    },
    async redirects() {
      return [
        {
          source: '/2015/08/31/remap-keys-in-os-x-tutorial-for-emacs-lovers.html',
          destination: '/blog/remap-keys-in-os-x-tutorial-for-emacs-lovers',
          permanent: true,
        },
        {
          source: '/2015/09/03/xcode-project-build-number-use-svn-revision.html',
          destination: '/blog/xcode-project-build-number-use-svn-revision',
          permanent: true,
        },
        {
          source: '/2015/09/16/helloworld-docker-on-osx-without-boot2docker.html',
          destination: '/blog/helloworld-docker-on-osx-without-boot2docker',
          permanent: true,
        },
        {
          source: '/2015/10/01/how-to-download-xcode-with-aria2c.html',
          destination: '/blog/how-to-download-xcode-with-aria2c',
          permanent: true,
        },
        {
          source: '/2018/01/24/started-to-learn-korean.html',
          destination: '/blog/started-to-learn-korean',
          permanent: true,
        },
        {
          source: '/2019/03/31/macos-mojave-s-dark-mode-for-jekyll-default-theme-minima.html',
          destination: '/blog/macos-mojave-s-dark-mode-for-jekyll-default-theme-minima',
          permanent: true,
        },
        {
          source: '/2019/06/09/deploy-jekyll-blog-on-gitlab-pages-with-cloudflare-origin-ca.html',
          destination: '/blog/deploy-jekyll-blog-on-gitlab-pages-with-cloudflare-origin-ca',
          permanent: true,
        },
        {
          source: '/2019/06/10/resign-ipas-with-fastlane-for-jailbreak.html',
          destination: '/blog/resign-ipas-with-fastlane-for-jailbreak',
          permanent: true,
        },
        {
          source: '/2019/06/11/inspect-the-view-hierarchy-of-any-ios-apps-on-ios-12.html',
          destination: '/blog/inspect-the-view-hierarchy-of-any-ios-apps-on-ios-12',
          permanent: true,
        },
        {
          source: '/2019/06/12/apps-fail-to-get-wi-fi-info-on-ios-13.html',
          destination: '/blog/apps-fail-to-get-wi-fi-info-on-ios-13',
          permanent: true,
        },
        {
          source: '/2019/06/24/upgrade-to-raspbian-buster-debian-10-for-raspberry-pi.html',
          destination: '/blog/upgrade-to-raspbian-buster-debian-10-for-raspberry-pi',
          permanent: true,
        },
        {
          source: '/2019/07/09/using-gpg-to-encrypt-messages.html',
          destination: '/blog/using-gpg-to-encrypt-messages',
          permanent: true,
        },
        {
          source: '/2019/07/10/gnu-linux-tar-command-cheat-sheet.html',
          destination: '/blog/gnu-linux-tar-command-cheat-sheet',
          permanent: true,
        },
        {
          source: '/2019/07/28/using-aircrack-ng-with-rtl8814au.html',
          destination: '/blog/using-aircrack-ng-with-rtl8814au',
          permanent: true,
        },
        {
          source: '/2020/01/25/build-openwrt-19-07-for-tl-wr703n.html',
          destination: '/blog/build-openwrt-19-07-for-tl-wr703n',
          permanent: true,
        },
        {
          source: '/2021/03/28/started-to-learn-russian.html',
          destination: '/blog/started-to-learn-russian',
          permanent: true,
        },
        {
          source: '/2021/03/28/started-to-learn-russian.html',
          destination: '/blog/started-to-learn-russian',
          permanent: true,
        },
        {
          source: '/2021/08/15/network-layer-ip-address-blocking.html',
          destination: '/blog/network-layer-ip-address-blocking',
          permanent: true,
        },
        {
          source: '/2021/12/05/moving-to-new-yubikeys.html',
          destination: '/blog/moving-to-new-yubikeys',
          permanent: true,
        },
      ]
    },
  })
}
