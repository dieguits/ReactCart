import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import TopMenu from './components/TopMenu';
import Products from './components/Products';
import useFetch from './hooks/useFetch';
import { urlApiProducts, STORAGE_PRODUCTS_CART } from './utils/constants';

function App() {

	const products = useFetch(urlApiProducts, null);
	const [productCart, setProductCart] = useState([]);

	useEffect(() => {
		getProductsCart();
	}, [])

	const getProductsCart = () => {
		const idProducts = localStorage.getItem(STORAGE_PRODUCTS_CART);

		if (idProducts) {
			const idProductSplit = idProducts.split(',');
			setProductCart(idProductSplit);
		} else {
			setProductCart([]);
		}
	}

	const addProductCart = (id, name) => {
		//console.log(`Has añadido el producto ${name} con el id ${id}.`)

		const idProducts = productCart;
		idProducts.push(id);
		setProductCart(idProducts);
		localStorage.setItem(STORAGE_PRODUCTS_CART, productCart);
		getProductsCart();
		toast.success(`${name} added to the cart correct.`)
	}

	return (
		<div className="App">
			<TopMenu productCart={productCart} />
			<Products products={products} addProductCart={addProductCart} />
			<ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop
				closeOnClick={false}
				rtl={false} pauseOnHover={false} />
		</div>
	);
}

export default App;
