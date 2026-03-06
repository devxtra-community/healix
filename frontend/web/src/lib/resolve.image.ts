const S3_BASE = 'https://healix-product-images.s3.ap-south-1.amazonaws.com/';

export function resolveImage(src?: string | null): string {
  if (!src) return '/placeholder.png';

  if (src.startsWith('http')) return src;

  return `${S3_BASE}${src}`;
}
