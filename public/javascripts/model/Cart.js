function Cart(){

}

Cart.prototype.init = function(){
    localStorage.getItem('cartItems') || (localStorage.cartItems = JSON.stringify({}));
    localStorage.getItem('cartCount') || (localStorage.cartCount = JSON.stringify(0));
};

Cart.prototype.addItem = function(itemId){
    var currentItems = Cart.getAllItem();
    var needToUpdateItems = currentItems;
    if(!currentItems[itemId]){
        needToUpdateItems[itemId] = 1;
    }else{
        needToUpdateItems[itemId] = parseInt(needToUpdateItems[itemId]) + 1;
    }
    this.updateCart(needToUpdateItems);
};

Cart.getAllItem = function(){
    return JSON.parse(localStorage.getItem('cartItems'));
};

Cart.getCartCount = function(){
    return JSON.parse(localStorage.getItem('cartCount'));
};

Cart.prototype.updateCart = function(items){
    localStorage.cartItems = JSON.stringify(items);
    localStorage.cartCount = parseInt(Cart.getCartCount()) + 1;
};