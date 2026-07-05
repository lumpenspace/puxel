// Vite's `?raw` import suffix yields the file contents as a string.
declare module "*.svg?raw" {
  const content: string;
  export default content;
}
