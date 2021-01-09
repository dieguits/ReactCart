import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { ReactComponent as CartEmpty } from '../../assets/img/cart-empty.svg';
import { ReactComponent as CartFull } from '../../assets/img/cart-full.svg';
import { ReactComponent as Close } from '../../assets/img/close.svg';
import { ReactComponent as Garbage } from '../../assets/img/garbage.svg';
import { STORAGE_PRODUCTS_CART, BASE_PATH } from '../../utils/constants';
import { countDuplicateItemArray, removeArrayDuplications } from '../../utils/arrayFunctions';

import './Cart.scss';

export default function Cart(props) {

    const { productCart, getProductsCart, products, addProductCart } = props;
    const [cartOpen, setCartOpen] = useState(false);
    const widthCartContent = cartOpen ? 400 : 0;
    const [singleProductsCart, setSingleProductsCart] = useState([]);

    useEffect(() => {
        const allProductsId = removeArrayDuplications(productCart);
        setSingleProductsCart(allProductsId);
        //console.log('the no duplications products:::: ', allProductsId);
    }, [productCart]);

    console.log(productCart);

    const openCart = () => {
        setCartOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeCart = () => {
        setCartOpen(false);
        document.body.style.overflow = 'scroll';
    };

    const emptyCart = () => {
        localStorage.removeItem(STORAGE_PRODUCTS_CART);
        getProductsCart();
    }

    return (
        <>
            <Button variant="link" className="cart">
                {productCart.length > 0 ? (
                    <CartFull onClick={cartOpen && productCart.length > 0 ? closeCart : openCart} />
                ) : (
                        <CartEmpty onClick={cartOpen && productCart.length > 0 ? closeCart : openCart} />
                    )}
            </Button>
            <div className="cart-content" style={{ width: widthCartContent }} >
                <CartContentHeader closeCart={closeCart} emptyCart={emptyCart} />
                {singleProductsCart.map((idProduct, index) => (
                    <CartContentProducts key={index} products={products} productCart={productCart} idProduct={idProduct} addProductCart={addProductCart} />
                ))}

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
    )
}

function CartContentProducts(props) {

    const {
        products: {
            loading,
            result
        },
        productCart,
        idProduct, addProductCart
    } = props;

    //console.log('THOSE ARE THE PRODUCTS:::: ', result);

    if (!loading && result) {
        return result.map((product, index) => {
            if (idProduct == product.id) {
                const quantity = countDuplicateItemArray(product.id, productCart);
                return (
                    <RenderProduct key={index} product={product} quantity={quantity} addProductCart={addProductCart} />
                )
            }
        })
    }

    return null;
}

function RenderProduct(props) {

    const { product, quantity, addProductCart } = props;

    return (
        <div className="cart-content__product">
            <img src={`${BASE_PATH}/${product.image}`} alt={product.name} />
            <div className="cart-content__product-info">
                <div>
                    <h3>{product.name.substr(0, 25)}</h3>
                    <p>{product.price.toFixed(2)} $ / Uni.</p>
                </div>
                <div>
                    <p>In Cart: {quantity} Uni.</p>
                    <div>
                        <button onClick={() => addProductCart(product.id, product.name)}>+</button>
                        <button>-</button>
                    </div>
                </div>
            </div>
        </div>
    )
}