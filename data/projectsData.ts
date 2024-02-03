interface Project {
  title: string,
  description: string,
  href?: string,
  imgSrc?: string,
}

const projectsData: Project[] = [
  {
    title: 'Country-IP-Blocks',
    description: `A list of countries and their IP blocks in CIDR notation.
    Updated by GitHub actions everyday. The list is hosted on GitHub Pages
    and can be used for IP filtering. Source code for generating the list is also available.`,
    imgSrc: 'https://www.iana.org/_img/2013.1/rir-map.svg',
    href: 'https://github.com/HackingGate/Country-IP-Blocks',
  },
  {
    title: 'Typst Out',
    description: `A GitHub Action to build Typst files in your repository using a custom Typst Git ref,
    producing configurable output files and uploading them as artifacts. Supports caching.
    `,
    imgSrc: '/static/images/Typst-Out.webp',
    href: 'https://github.com/marketplace/actions/typst-out',
  },
  {
    title: 'MyAnimeList-AppleMultiplatform',
    description: `Unofficial MyAnimeList app for Apple TV, iPhone, iPad and Mac 
    rewritten in SwiftUI and SwiftUIFlux (previous was TVML/TVJS).
    Supports metadata browsing and anime watching.`,
    imgSrc: '/static/images/MyAnimeList-AppleMultiplatform.webp',
    href: 'https://github.com/HackingGate/MyAnimeList-AppleMultiplatform',
  },
  {
    title: 'PDFReader',
    description: `iOS app integrates with the Files app to provide an easy way to read PDFs.
    With experimental support of RTL reading experience for Arabic, Hebrew, and RTL CJK languages.`,
    imgSrc: '/static/images/PDFReader/Cover.webp',
    href: '/blog/a-pdf-reader-app-for-iOS-11',
  },
  {
    title: 'SwiftUI Car Controller',
    description: `A SwiftUI client and Python server set to control your Raspberry Pi powered car
    using MFi gamepad and WebSocket communication protocol over WiFi.
    Requires Xcode 11, Python3, and hardware setup.`,
    imgSrc: '/static/images/SwiftUI-Car-Controller.webp',
    href: 'https://github.com/HackingGate/SwiftUI-Car-Controller',
  },
  {
    title: 'Reveal2Loader (fork)',
    description: `Reveal Loader dynamically loads libReveal.dylib (Reveal.app support) into iOS apps on jailbroken devices.
    This GitHub fork adds support for iOS 12 and tested with latest Reveal.app versions in 2019 and 2020.`,
    imgSrc: '/static/images/Reveal-App-Store.webp',
    href: 'https://github.com/HackingGate/Reveal2Loader',
  },
  {
    title: 'APN Messages Demo',
    description: `A demo app to send messages via Apple Push Notification service (APNs) using Swift.
    By stores a record in CloudKit and no need to manage a server.
    Supports end-to-end encryption.`,
    imgSrc: '/static/images/APN-Messages-Demo.webp',
    href: 'https://github.com/HackingGate/APN-Messages-Demo',
  },
]

export default projectsData
