import { CartItem } from "@/redux/featutures/cart/cartSlice";

export const deliveryFee = 5;
export const getCartQuantity = (cart : CartItem[]) : number => {
    return cart.reduce((quantity , item) => quantity + item.quantity! , 0)
};

export const getItemQuantity = ({itemId , cart} : {itemId : string , cart : CartItem[]}) => {
    const item = cart.find((ele) => ele.id === itemId);

    return item ? item.quantity : 0
}

export const getSubTotal = ( cart : CartItem[]) => {
    return cart.reduce((total , item) => {
        const extrasTotal = item.extras?.reduce((sum , extra) => sum + (extra.price || 0), 0) ;
        const totalPrice = item.basePrice + (item.size?.price || 0) + (extrasTotal || 0) ;

        return total + totalPrice * item.quantity!
    },0)   
}

export const getTotalAmount = (cart : CartItem[]) => {
    return getSubTotal(cart) + deliveryFee
}