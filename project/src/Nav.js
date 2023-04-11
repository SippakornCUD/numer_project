import React from "react";
import { NavLink } from '@mantine/core';
import { Link } from "react-router-dom";


function Nav(){
    return(
        <div>
            <NavLink label="Root of Equation">
                <NavLink component={Link} to="/Bisection" label="Bisection Method" />
                <NavLink component={Link} to="/False_Position" label="False-Position Method" />
                <NavLink component={Link} to="/One_Point" label="One-Point Iteration Method" />
                <NavLink component={Link} to="/Taylor" label="Taylor Serie Method" />
                <NavLink component={Link} to="/Newton" label="Newton Raphson Method" />
                <NavLink component={Link} to="/Secant" label="Secant Method" />
            </NavLink>
            <NavLink label="Linear Algebra">
                <NavLink component={Link} to="/Cramer" label="Cramer's Rule" />
                <NavLink component={Link} to="/GEliminate" label="Gauss Elimination Method" />
                <NavLink component={Link} to="/GJordan" label="Gauss Jordan Method" />
                <NavLink component={Link} to="/MatrixInver" label="Matrix Inversion Method" />
                <NavLink component={Link} to="/LUDecom" label="LU Decomposition Method" />
                <NavLink component={Link} to="/Cholesky" label="Cholesky Method" />
                <NavLink component={Link} to="/Jacobi" label="Jacobi Method" />
                <NavLink component={Link} to="/GSeidel" label="Gauss Seidel Method" />
                <NavLink component={Link} to="/Conjugate" label="Conjugate Gradient Method" />
            </NavLink>
            <NavLink label="Test File">
                <NavLink component={Link} to="/Sample" label="Sample file" />
                <NavLink component={Link} to="/Test" label="test file" />
                <NavLink component={Link} to="/Test2" label="test2 file" />
                <NavLink component={Link} to="/Test3" label="test3 file" />
            </NavLink>
        </div>
    );
}
export default Nav;