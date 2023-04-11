import React, { useState } from 'react'
import { Button } from "react-bootstrap"

function Test2() {

  const [size, setsize] = useState('')
  const [matrix, setmatrix] = useState('')
  let sizeinput

  const submit = e =>{
    sizeinput =e.target.value;
    setsize(sizeinput)
    genarate(sizeinput)
  }

  //create input value matrix
  function genarate(sizeinput){
    let array = [] //array for create input feilds matrixa
    let arrayb = [] //array for create input feilds matrixb       
    let tempb = [] //template input feild for matrix b
    for(let i=0 ; i<sizeinput ; i++){
      array[i] = [] //render jsx arr
      tempb.push(
      <div>
            <input
            id={"rowb"+i}
            />
      </div>
      )
      let temp = [] //template input feild for matrix a
      for(let j=0 ; j<sizeinput ; j++){
        let id = "column"+i+"row"+j
        temp.push(
        <input
        id={id}
        />
        )  
      }
      array[i].push(<div class='matrix a'>{temp}</div>)
      
    }
    arrayb.push(<div class='matrix b'>{tempb}</div>)


    //setmatrix hook
    setmatrix({a:array,b:arrayb})
  }

  const cal = e =>{
    // e.preventDefault()
    
    let calmatrix = []
    let tempb = []

    //setmatrix a&b
    for(let i=0 ; i<size ; i++){
      calmatrix[i] = []
      tempb.push(Number(document.getElementById('rowb'+i).value))
      console.log(Number(document.getElementById('rowb'+i).value))
      for(let j=0 ; j<size ; j++){
        //console.log(Number(document.getElementById('column'+j+'row'+j).value))
        calmatrix[i].push(Number(document.getElementById('column'+i+'row'+j).value))
      }
    }
    console.log(calmatrix)
    console.log(tempb)


    //MatrixLU jsx arr
    let matrixL = []
    let matrixU = []
    for(let i=0 ; i<size ; i++){
      matrixL[i] = []
      matrixU[i] = []
      for(let j=0 ; j<size ; j++){
        matrixL[i][j] = 0
        matrixU[i][j] = 0
      }
      console.log( matrixL[i]);
      console.log( matrixU[i]);
    }
    
    for(let i = 0; i < size; i++)
    {
      for(let k = i; k < size; k++)
      {
          let sum = 0;
          for(let j = 0; j < i; j++){
            console.log(matrixU[j][k]);
            sum += (matrixL[i][j] * matrixU[j][k]);
          }
          matrixL[k][i] = calmatrix[i][k] - sum;

      }
    //  console.log(matrixL);
      for(let k = i; k < size; k++)
        {
            if (i === k)
                matrixU[i][i] = 1;
            else
            {       
                let sum = 0;
                for(let j = 0; j < i; j++)
                    sum += (matrixL[k][j] * matrixU[j][i]);
                // Evaluating L(k, i)
                matrixU[i][k] = (calmatrix[i][k] - sum)/matrixL[i][i];
                console.log( "L",i,k,matrixL[k][i]);
            }
        }
        console.log( "U",matrixU);
    }
    console.log(matrixL)
    console.log(matrixU)

    // Ly = B
    let y = [];
    for (let i = 0; i < size; i++) {
      let sum = 0;
      for (let j = 0; j < i; j++) {
        sum += matrixL[i][j] * y[j];
      }
      y[i] = (tempb[i] - sum) / matrixL[i][i];
    }
    // Ux = y
    let x = [];
    for (let i = size - 1; 0 <= i; i--) {
      let sum = 0;
      if (matrixU[i][i] === 0) {
        continue;
      }
      for (let j = size - 1; j > i; j--) {
        sum += matrixU[i][j] * x[j];
      }
      x[i] = (y[i] - sum) / matrixU[i][i];
    }

    //output on page
    let ansarr = []
    let ansy =[]
    for(let a=0 ; a<x.length ; a++){
      ansarr.push(
        <div>x{a+1}={x[a].toFixed(2)}</div>
      )
      ansy.push(
        <div>Y{a+1}={y[a].toFixed(2)}</div>
      )
    }

    let arrL = []
    let arrU = []
    for(let a=0 ; a<size ; a++){
      arrL[a]=[]
      arrU[a]=[]
      let L = []
      let U = []
      for(let b=0 ; b<size ; b++){
        L.push(<input value={matrixL[a][b]} />)
        U.push(<input value={matrixU[a][b]} />)
      }
      console.log(L);
      arrL[a].push(<div>{L}</div>)
      arrU[a].push(<div>{U}</div>)
    }
    //console.log(matrixL)
    setmatrix({a:matrix.a,b:matrix.b,c:ansarr,l:arrL,u:arrU,g:ansy})
  }


  return (
    <div className='ludecomposition'>
      <form>
        <h1>Lu Decomposition</h1>
        <label for="size">Enter size is here {'->'}</label>
        <input name="size" type="size" onChange={submit}/><br/><br/>
      </form><br/><br/>
      <div class='matrixlu'style={{display: 'flex'}}>
        <div class='matrixw' style={{marginRight:"30px"}}>
        {
          matrix.a 
        }
        </div>
        <div class='matrixw'>
        {
          matrix.b
        }
        </div>
      </div><br/>
      <Button  variant="dark" onClick={cal}>Cal</Button><br/><br/>
    <div className='matrixf' style={{display: 'block'}}>
        <div style={{marginRight:"20px"}}>
        MATRIX L -{">"}
        {
          matrix.l
        }
        </div>
        <div style={{marginTop:'30px'}}>
        MATRIX U-{">"}
        {
          matrix.u
        }
        </div>
      </div><br/>

      <div className='matrix f'>
        MATRIX Y -{">"}
        {
          matrix.g
        }
      </div>
      <div className='matrix f'>
        MATRIX X -{">"}
        {
          matrix.c
        }
      </div>
    </div>
  )
}

export default Test2