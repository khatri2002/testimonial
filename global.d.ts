export {};

declare global {
  interface Window {
    TestimonialWall: {
      init: (options: { iframeId: string }) => void;
    };
  }
}
