declare module "prismjs" {
  export interface Prism {
    highlightAll(): void;
  }

  const Prism: Prism;
  export default Prism;
}
