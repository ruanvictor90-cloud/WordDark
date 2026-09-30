export function createCart({id,customerId,items=[]}) {
  if (!id || !customerId) throw new Error("INVALID_CART");
  return {id,customerId,items,status:"OPEN"};
}
export function addCartItem(cart,item){ if(cart.status !== "OPEN") throw new Error("CART_CLOSED"); return {...cart,items:[...cart.items,item]}; }
