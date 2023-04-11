import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Bisection from './root_method/Bisection.js';
import FalsePosition from './root_method/False_Position.js';
import Newton from './root_method/Newton.js';
import OnePoint from './root_method/One_Point.js';
import Secant from './root_method/Secant.js';
import Taylor from './root_method/Taylor.js';
import Sample from './root_method/Sample.js';
import Test from './root_method/Test.js';
import Test2 from './root_method/Test2.js';
import Test3 from './root_method/Test3.js';
import Cramer from './Linear_Algebra/L1_Cramer.js';
import GEliminate from './Linear_Algebra/L2_GEliminate.js';
import GJordan from './Linear_Algebra/L3_GJordan.js';
import MatrixInversion from './Linear_Algebra/L4_Matrix_Inversion.js';
import LUDecomposition from './Linear_Algebra/L5_LU_Decom.js';
import Cholesky from './Linear_Algebra/L6_Cholesky.js';
import Jacobi from './Linear_Algebra/L7_Jacobi.js';
import GSeidel from './Linear_Algebra/L8_GSeidel.js';
import ConjugateGradient from './Linear_Algebra/L9_Conjugate_Gradient.js';


function Routepage() {
  return(
    <div>
      <Routes>
        <Route path="/Bisection" element={<Bisection />}/>
        <Route path="/False_Position" element={<FalsePosition />}/>
        <Route path="/One_Point" element={<OnePoint />}/>
        <Route path="/Taylor" element={<Taylor />}/>
        <Route path="/Newton" element={<Newton />}/>
        <Route path="/Secant" element={<Secant />}/>
        <Route path="/Sample" element={<Sample />}/>
        <Route path="/Test" element={<Test />}/>
        <Route path="/Test2" element={<Test2 />}/>
        <Route path="/Test3" element={<Test3 />}/>
        <Route path="/Cramer" element={<Cramer />}/>
        <Route path="/GEliminate" element={<GEliminate />}/>
        <Route path="/GJordan" element={<GJordan />}/>
        <Route path="/MatrixInver" element={<MatrixInversion />}/>
        <Route path="/LUDecom" element={<LUDecomposition />}/>
        <Route path="/Cholesky" element={<Cholesky />}/>
        <Route path="/Jacobi" element={<Jacobi />}/>
        <Route path="/GSeidel" element={<GSeidel />}/>
        <Route path="/Conjugate" element={<ConjugateGradient />}/>
      </Routes>
    </div>
  );
}
export default Routepage;