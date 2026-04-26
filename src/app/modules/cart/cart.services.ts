import { prisma } from "../../shared/prisma";

const addToCart = async (payload: {
  userId: string;
  itemId: string;
  quantity: number;
}) => {
  // 1. Check if this exact item is already in this user's cart
  const existingCartItem = await prisma.cartItem.findFirst({
    where: {
      userId: payload.userId,
      itemId: payload.itemId,
    },
  });

  // 2. If it exists, just increase the quantity
  if (existingCartItem) {
    return await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + payload.quantity },
      include: { item: true }, // Returns the item details back to the frontend
    });
  }

  // 3. If it doesn't exist, create a new cart entry
  return await prisma.cartItem.create({
    data: payload,
    include: { item: true },
  });
};

const getMyCart = async (userId: string) => {
  // Fetch all cart items for this specific user
  return await prisma.cartItem.findMany({
    where: { userId },
    include: {
      item: true, // Crucial: This joins the Item table so you get the images, title, and price!
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateCartItemQuantity = async (cartItemId: string, quantity: number) => {
  // If the frontend sends quantity 0, we delete the item from the cart
  if (quantity <= 0) {
    return await prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  return await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
    include: { item: true },
  });
};

const removeFromCart = async (cartItemId: string) => {
  return await prisma.cartItem.delete({
    where: { id: cartItemId },
  });
};

export const CartServices = {
  addToCart,
  getMyCart,
  updateCartItemQuantity,
  removeFromCart,
};
