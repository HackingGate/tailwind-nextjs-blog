import { ImageProps as NextImageProps } from 'next/image'

interface ImageProps extends Omit<NextImageProps, 'src'> {
  src: string
}

const Image = ({ src, alt, ...rest }: ImageProps) => <img src={src} alt={alt} {...rest} />

export default Image
