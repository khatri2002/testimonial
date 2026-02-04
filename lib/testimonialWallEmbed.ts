export const getTestimonialWallEmbedCode = (id: string) => {
  const domain = process.env.NEXT_PUBLIC_APP_URL;
  const embedCode = `<script src="https://cdn.jsdelivr.net/gh/khatri2002/testimonial-wall-embed/embed.min.js"></script>
<iframe id="testimonial-wall" src="${domain}/embed-wall/${id}" frameborder="0" scrolling="no" width="100%"></iframe>
<script>TestimonialWall.init({iframeId: "testimonial-wall"});</script>
`;

  return embedCode;
};
