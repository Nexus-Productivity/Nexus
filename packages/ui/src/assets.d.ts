declare module "*.png" {
  /** Compatible con StaticImageData de Next.js y con el asset handling de Vite. */
  const content: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  };
  export default content;
}