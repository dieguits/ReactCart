import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { ReactComponent as CartEmpty } from "../../assets/img/cart-empty.svg";
import { ReactComponent as CartFull } from "../../assets/img/cart-full.svg";
import { ReactComponent as Close } from "../../assets/img/close.svg";
import { ReactComponent as Garbage } from "../../assets/img/garbage.svg";
import { STORAGE_PRODUCTS_CART, BASE_PATH } from "../../utils/constants";
import { countDuplicateItemArray, removeArrayDuplications, removeItemArray } from "../../utils/arrayFunctions";

import "./Cart.scss";

export default function Cart(props) {
    const { productCart, getProductsCart, products, addProductCart } = props;
    const [cartOpen, setCartOpen] = useState(false);
    const widthCartContent = cartOpen ? 400 : 0;
    const [singleProductsCart, setSingleProductsCart] = useState([]);
    const [cartTotalPrice, setCartTotalPrice] = useState(0);

    useEffect(() => {
        const allProductsId = removeArrayDuplications(productCart);
        setSingleProductsCart(allProductsId);
        //console.log('the no duplications products:::: ', allProductsId);
    }, [productCart]);

    useEffect(() => {
        const productData = [];
        let totalPrice = 0;

        const allProducts = removeArrayDuplications(productCart);

        allProducts.forEach((productId) => {
            const quantity = countDuplicateItemArray(productId, productCart);
            const productValue = {
                id: productId,
                quantity: quantity,
            };
            productData.push(productValue);
        });

        if (!products.loading && products.result) {
            products.result.forEach((product) => {
                productData.forEach((item) => {
                    if (product.id == item.id) {
                        const totalValue = product.price * item.quantity;
                        totalPrice = totalPrice + totalValue;
                    }
                });
            });
        }
        setCartTotalPrice(totalPrice);
        console.log("The product DATA:::::::: ", totalPrice);
    }, [productCart, products]);

    console.log(productCart);

    const openCart = () => {
        setCartOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeCart = () => {
        setCartOpen(false);
        document.body.style.overflow = "scroll";
    };

    const emptyCart = () => {
        localStorage.removeItem(STORAGE_PRODUCTS_CART);
        getProductsCart();
    };

    const decreaseProductCart = (id) => {
        const idProducts = removeItemArray(productCart, id.toString());
        //setProductCart(idProducts);
        localStorage.setItem(STORAGE_PRODUCTS_CART, idProducts);
        getProductsCart();
        //toast.success(`${name} added to the cart correct.`)
    };

    return (
        <>
            <Button variant="link" className="cart">
                {productCart.length > 0 ? <CartFull onClick={openCart} /> : <CartEmpty onClick={openCart} />}
            </Button>
            <div className="cart-content" style={{ width: widthCartContent }}>
                <CartContentHeader closeCart={closeCart} emptyCart={emptyCart} />
                <div className="cart-content__products">
                    {singleProductsCart.map((idProduct, index) => (
                        <CartContentProducts
                            key={index}
                            products={products}
                            productCart={productCart}
                            idProduct={idProduct}
                            addProductCart={addProductCart}
                            decreaseProductCart={decreaseProductCart}
                        />
                    ))}
                </div>
                <CartContentFooter cartTotalPrice={cartTotalPrice} />
            </div>
        </>
    );
}

function CartContentHeader(props) {
    const { closeCart, emptyCart } = props;

    return (
        <div className="cart-content__header">
            <div>
                <Close onClick={closeCart} />
                <h2>Cart</h2>
            </div>

            <Button variant="link" onClick={emptyCart}>
                Clear
                <Garbage />
            </Button>
        </div>
    );
}

function CartContentProducts(props) {
    const {
        products: { loading, result },
        productCart,
        idProduct,
        addProductCart,
        decreaseProductCart,
    } = props;

    if (!loading && result) {
        return result.map((product, index) => {
            if (idProduct == product.id) {
                const quantity = countDuplicateItemArray(product.id, productCart);
                return (
                    <RenderProduct
                        key={index}
                        product={product}
                        quantity={quantity}
                        addProductCart={addProductCart}
                        decreaseProductCart={decreaseProductCart}
                    />
                );
            }
        });
    }

    return null;
}

function RenderProduct(props) {
    const { product, quantity, addProductCart, decreaseProductCart } = props;

    return (
        <div className="cart-content__product">
            <img src={`${BASE_PATH}/${product.image}`} alt={product.name} />
            <div className="cart-content__product-info">
                <div>
                    <h3>{product.name.substr(0, 25)}...</h3>
                    <p>{product.price.toFixed(2)} $ / Uni.</p>
                </div>
                <div>
                    <p>In Cart: {quantity} Uni.</p>
                    <div>
                        <button onClick={() => addProductCart(product.id, product.name)}>+</button>
                        <button onClick={() => decreaseProductCart(product.id)}>-</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CartContentFooter(props) {
    const { cartTotalPrice } = props;
    console.log("Those are the props:::::: ", props);
    return (
        <div className="cart-content__footer">
            <div>
                <p>Total: </p>
                <p>$ {cartTotalPrice.toFixed(2)}</p>
                {/* <p>$ 45.34</p> */}
            </div>
            <Button >Tramitar Pedido</Button>
        </div>
    );
}
