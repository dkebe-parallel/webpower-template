// Maps specific stock image filenames to a custom object-position value.
// Use this for images whose subject isn't well-centered by default.
// Default for all images not listed here: 'center'.
export const imagePositionOverrides: Record<string, string> = {
  'hero-5.webp':   '55% center', // face is right of center; shift crop toward face
  'whyus-5.webp':  'center 15%', // head near top of tall portrait; anchor crop high
}

export function getObjectPosition(imageSrc?: string): string {
  if (!imageSrc) return 'center'
  const filename = imageSrc.split('/').pop() ?? ''
  return imagePositionOverrides[filename] ?? 'center'
}
