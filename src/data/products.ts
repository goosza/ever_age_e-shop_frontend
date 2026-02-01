export type Product = {
  id: string;
  title: string;
  price: number;
  shortDescription?: string;
  image: string;
  modelUrl?: string;
  available?: boolean;
  kolekce?: string;
  colour?: string;
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
    kolekce : "Alien",
  },
  {
    id: "p2",
    title: "Product Two",
    price: 49,
    shortDescription: "Short description for product two.",
    image: "/products/product-two.jpg",
    available: true,
    kolekce : "Tribal",
  },
  {
    id: "p3",
    title: "Product Three",
    price: 79,
    shortDescription: "Short description for product three.",
    image: "/products/product-three.jpg",
    available: false,
    kolekce : "Tribal",
  },

  {
  id: "p4",
    title: "Product Four",
    price: 29,
    shortDescription: "Short description for product four.",
    image: "/products/product-four.jpg",
    available: true,
    kolekce : "Alien",
},
{
  id: "p5",
    title: "Product Five",
    price: 49,
    shortDescription: "Short description for product five.",
    image: "/products/product-five.jpg",
    available: true,
},
{
  id: "p6",
    title: "Product Six",
    price: 79,
    shortDescription: "Short description for product six.",
    image: "/products/product-six.jpg",
    available: false,
    kolekce : "Tribal",
},

  {
    id: "p7",
    title: "Product Seven",
    price: 49,
    shortDescription: "Short description for product seven.",
    image: "/products/product-seven.jpg",
    available: true,
    kolekce : "Tribal",
  },
  {
    id: "p8",
    title: "Product Eight",
    price: 79,
    shortDescription: "Short description for product eight.",
    image: "/products/product-eight.jpg",
    available: false,
    kolekce : "Teeth",
  },
    
  {
    id: "p9",
    title: "Product Nine",
    price: 79,
    shortDescription: "Short description for product nine.",
    image: "/products/product-nine.jpg",
    available: false,
    kolekce : "Tribal",
  },
];