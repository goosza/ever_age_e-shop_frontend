export type Product = {
  id: string;
  title: string;
  price: number;
  shortDescription?: string;
  image: string;
  modelUrl?: string;
  available?: boolean;
};

export const products: Product[] = [
  {
    id: "p1",
    title: "ALIEN BAG",
    price: 150000,
    shortDescription: "Purse made in collaboration with czech brand Praga By Matous Fiala. \n" +
        "\n" +
        "Designed, 3D printed and postprocessed by hand by me.",
    image: "/products/product-one.jpg",
    available: true,
  },
  {
    id: "p2",
    title: "Product Two",
    price: 49,
    shortDescription: "Short description for product two.",
    image: "/products/product-two.jpg",
    available: true,
  },
  {
    id: "p3",
    title: "Product Three",
    price: 79,
    shortDescription: "Short description for product three.",
    image: "/products/product-three.jpg",
    available: false,
  },

  {
  id: "p4",
    title: "Product One",
    price: 29,
    shortDescription: "Short description for product one.",
    image: "/products/product-one.jpg",
    available: true,
},
{
  id: "p5",
      title: "Product Two",
    price: 49,
    shortDescription: "Short description for product two.",
    image: "/products/product-two.jpg",
    available: true,
},
{
  id: "p6",
      title: "Product Three",
    price: 79,
    shortDescription: "Short description for product three.",
    image: "/products/product-three.jpg",
    available: false,
},

  {
    id: "p7",
    title: "Product Two",
    price: 49,
    shortDescription: "Short description for product two.",
    image: "/products/product-two.jpg",
    available: true,
  },
  {
    id: "p8",
    title: "Product Three",
    price: 79,
    shortDescription: "Short description for product three.",
    image: "/products/product-three.jpg",
    available: false,
  },
];