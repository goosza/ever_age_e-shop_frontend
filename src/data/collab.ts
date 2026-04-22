export type Collab = {
  id: string;
  title: string;
  description: string;
  /** Paths relative to /public */
  images: string[];
};

export const collabs: Collab[] = [
  {
    id: "collab-alpha",
    title: "Collab Alpha",
    description: "Short description for Collab Alpha. Details about collaboration, designers and materials.",
    images: ["/alpha.gif"],
  },
  {
    id: "collab-beta",
    title: "Collab Beta",
    description: "Short description for Collab Beta. Story, features and release notes.",
    images: ["/beta.png"],
  },
  {
    id: "collab-gamma",
    title: "Collab Gamma",
    description: "Short description for Collab Gamma. Limited edition collection details.",
    images: ["/gamma.png"],
  },
  {
    id: "collab-delta",
    title: "Collab Delta",
    description: "Short description for Collab Delta. Limited edition collection details.",
    images: ["/delta.png"],
  },
];
