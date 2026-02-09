import { EMBED_WALL_CDN_URL } from "@/constants";

export const getTestimonialWallEmbedCode = (
  id: string | undefined,
  domain: string | undefined,
) => {
  const embedCode = `<script src="${EMBED_WALL_CDN_URL}"></script>
<iframe id="testimonial-wall" src="${domain}/embed-wall/${id}" frameborder="0" scrolling="no" width="100%"></iframe>
<script>TestimonialWall.init({iframeId: "testimonial-wall"});</script>
`;

  return embedCode;
};
