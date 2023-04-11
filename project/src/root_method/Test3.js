import React, { useState } from 'react'
import { create, all } from 'mathjs'
import { Button } from "react-bootstrap"

function JacobiIteration() {

  const [size, setsize] = useState('')
  const [matrix, setmatrix] = useState('')
  const config = { }
  const math = create(all, config)
let sizeinput

  const submit = e =>{
    sizeinput =e.target.value;
    setsize(sizeinput)
    genarate(sizeinput)
  }

  //create input value matrix
  function genarate(){
    let array = [] //array for create input feilds matrixa
    let arrayb = [] //array for create input feilds matrixb       
    let tempb = [] //template input feild for matrix b
    let er = []
    let tempx = []

    er.push(
      <div>
      <label for="size">Enter Error is here {'->'}</label>
      <input id="ERROR"/>
      </div>
    )

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
  
        let id = "row"+i
        tempx.push(
        <input
        id={id}
        />
        )  
      

      array[i].push(<div class='matrix a' >{temp}</div>)
      
    }
    arrayb.push(<div class='matrix b'>{tempb}</div>)

    //setmatrix hook
    setmatrix({a:array,b:arrayb,c:er,i:tempx})
  }

  const cal = e =>{
    e.preventDefault()
    let calmatrix = []
    let tempb = []
    let temper = []
    let tempx=[]
    let er

    //setmatrix a&b
    //seterror

    er = Number(document.getElementById('ERROR').value)
    for(let i=0 ; i<size ; i++){
      calmatrix[i] = []
      tempx.push(Number(document.getElementById('row'+i).value))
      temper[i] = 100.0
      tempb.push(Number(document.getElementById('rowb'+i).value))
      //console.log(Number(document.getElementById('rowb'+i).value))
      for(let j=0 ; j<size ; j++){
        //console.log(Number(document.getElementById('column'+j+'row'+j).value))
        calmatrix[i].push(Number(document.getElementById('column'+i+'row'+j).value))
      }
    }
    console.log(calmatrix)
    console.log(temper)
    console.log(tempb) 
    console.log(tempx);

    //calculator
    let x = []
    let round = 0
    let check = true
    console.log(calmatrix);
    console.log(tempb);
      do{
        check = false
        for(let i = 0 ;i < size; i++){
           x[i] = tempb[i];
          for(let j = 0 ;j < size; j++){
            if(i!==j){
              x[i] -= tempx[j]*calmatrix[i][j];  //คูนทีละตัว เอาไปลบกับค่า b
            }
          }
          // console.log(x[i]);
          x[i] = x[i]/calmatrix[i][i]; //หารเมทริก
          console.log(x[i]);
          // tempx[i] = x[i]
          round++
          console.log("i : ",i," x : ",x," tempx : ",tempx,"check : ",check,"err : ",/*err*/);
        }
        for(let i=0; i<size; i++){
          let err = math.abs((x[i]-tempx[i])/x[i])*100.0
          console.log("x : ",x,"tempx : ",tempx,"x["+i+"] : ",x[i],"tempx["+i+"]",tempx[i]);
          if(!check){
            if(err > 0.00001){
              check = true
            }
          }
          tempx[i]=x[i]
        }
        
        // console.log(check);
      }while(check)
    console.log(x)

    let ansarr = []
    for(let a=0 ; a<x.length ; a++){
      ansarr.push(
        <div>x{a+1}={x[a].toFixed(2)}</div>
      )
    }
    setmatrix({a:matrix.a,b:matrix.b,c:matrix.c,d:ansarr,i:matrix.i})
  }

  return (
    <div className='jacobiiteration'>
      <form>
        <h1>Jacobi Iteration</h1>
        <label for="size">Enter size is here {'->'}</label>
        <input name="size" type="size" onChange={submit}/><br/><br/>
      </form><br/>
      {(matrix.a === undefined )? null : 
      <div class='matrixf'style={{display: 'flex'}}>
        <div class='matrixw' style={{marginRight:"30px"}}>
          A
        {
          matrix.a 
        }
        </div>
        <div class='matrixw'>
          B 
        {
          matrix.b
        }
        </div>
      </div>}<br></br>
      {( matrix.i === undefined ) ? null : <div style={{marginRight:"20px"}}>X -{">"}{ matrix.i}</div>}
      <br/>
      <div>
        {
          matrix.c
        }
      </div><br/>
      <Button  variant="dark" onClick={cal}>Cal</Button><br/><br/>

      {( matrix.d === undefined ) ? null : <div style={{marginRight:"20px"}}> X { matrix.d}</div>}
    </div>
  )
}

export default JacobiIteration