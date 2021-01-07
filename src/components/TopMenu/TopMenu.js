import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import Cart from '../Cart';
import { ReactComponent as Logo } from '../../assets/img/cake.svg'

import './TopMenu.scss';

export default function TopMenu(props) {

    const { productCart } = props;

    return (
        <Navbar bg="dark" variant="dark" className="top-menu">
            <Container>
                <BrandNav />
                {/* <MenuNav /> */}
                {/*Carrito*/}
                <Cart productCart={productCart} />
            </Container>
        </Navbar>
    );
}


function BrandNav() {
    return (
        <Navbar.Brand>
            <Logo />
            <h2>Tortas de Mama</h2>
        </Navbar.Brand>
    )
}

function MenuNav() {
    return (
        <Nav className="mr-auto">
            <Nav.Item>
                <Nav.Link href="/home">Active</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="#">Cumpleaños</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="#">Matrimonios</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="#">Baby Showers</Nav.Link>
            </Nav.Item>
        </Nav>
    )

}