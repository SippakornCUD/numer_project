import { Center, Grid, Group, Container, Input, NumberInput, Button } from '@mantine/core'
import React, { useState } from 'react'

const L2_GEliminate = () => {
  const [ datainput, setDatainput ] =useState()
  const [ size, setSize ] = useState(2);
  const [ Result, setResult ] = useState();
  const [ step , setStep ] = useState()
  let listA=[]
  let listB=[]
  let ArrayA=[]
  let ArrayB=[]
  let allstep=[]
  let count;

  const createinput = () =>{
    listA=[]
    listB=[]
    let temp=[]
    // let row=[]
    for(let i=0;i<size;i++){
      temp=[]
      // row=[]
      for(let j=0;j<size;j++){
        // row.push(0)
        temp.push(<NumberInput data-testid={`x${i}${j}`} id={"A"+i+"_"+j} /*onChange={(value)=>{arrinput("A",i,j,value)}}*/ precision={6} removeTrailingZeros hideControls style={{width : "70px"}} />)
      }
      // ArrayA.push(row)
      // ArrayB.push(0)
      listB.push(<NumberInput data-testid={`y${i}`} id={"B"+i} /*onChange={(value)=>{arrinput("B",i,0,value)}}*/ precision={6} removeTrailingZeros hideControls style={{width : "70px", marginTop : "10px"}} />)
      listA.push(<Group noWrap style={{marginTop : 10}}>{temp}</Group>)
    }
  }

  const showinput=()=>{
    setDatainput(
      <div>
        <Group noWrap>
          <Container>
            Matrix A
            {listA}
          </Container>
          <Container>
            Matrix B
            {listB}
          </Container>
        </Group>
        <Button data-testid='calbtn' onClick={calfunc} fullWidth style={{marginTop : 20}}>
          Calculate
        </Button>
        <Button onClick={()=>{createMatrixArray()}} fullWidth style={{marginTop : 20}}>
          createMatrixArray
        </Button>
        <Button onClick={()=>{console.log(ArrayA," : ",ArrayB);}} fullWidth style={{marginTop : 20}}>
          Log
        </Button>
      </div>
    )
  }
  const createinputFunc=()=>{
    createinput()
    showinput()
  }
  
  const createMatrixArray = () =>{
    ArrayA=[]
    ArrayB=[]
    for(let i=0; i<size; i++){
      let row = []
      for(let j=0; j<size; j++){
        let valueA = parseFloat(document.getElementById("A"+i+"_"+j).value)
        if(isNaN(valueA) || valueA===""){
          row.push(0)
        }else{
          row.push(valueA)
        }
      }
      ArrayA.push(row)
      let valueB = parseFloat(document.getElementById("B"+i).value)
      if(isNaN(valueB) || valueB===""){
        ArrayB.push(0)
      }else{
        ArrayB.push(valueB)
      }
      
    }
  }
  const calfunc = () =>{
    createMatrixArray()
    Cal()
  }
  // const arrinput = (matrix,i,j,value) =>{
  //   if(value===undefined){
  //     value=0
  //   }
  //   if(matrix==="A"){
  //     ArrayA[i][j] = value
  //   }else{
  //     ArrayB[i] = value
  //   }
  // }

  const createstep =(text,matrixA,matrixB,row1,row2)=>{
    let matA=[]
    let matB=[]
    for(let j=0; j<matrixA.length; j++){
      let row=[]
      matrixA[j].map((item)=>{
        row.push(<NumberInput value={item} precision={2} hideControls style={{width : "80px"}} disabled/>)
      })
      matA.push(<Group noWrap>{row}</Group>)
      matB.push(<NumberInput value={matrixB[j]} precision={2} hideControls style={{width : "80px"}} disabled/>)
    }
    allstep.push(
      <Group>
        Step {count++} : {text} Matrix A [{row1.toString()}][{row2.toString()}]
        <Group noWrap>
          <Container>
            Matrix A : {matA}
          </Container>
          <Container>
            Matrix B : {matB}
          </Container>
        </Group>
      </Group>
    )
  }
  const Cal = () =>{
    allstep=[]
    count = 1
    for(let i=0; i<ArrayA.length; i++){
      if(ArrayA[i][i]===0){
        let check = true;
        let swaploc;
        for(let j=i+1; j<ArrayA.length; j++){
          if(ArrayA[j][i]!==0){
            [ArrayA[i], ArrayA[j]] = [ArrayA[j], ArrayA[i]];
            [ArrayB[i], ArrayB[j]] = [ArrayB[j], ArrayB[i]];
            swaploc = j
            check = false
            break;
          }
        }
        if(check){
          setDatainput(<div>ERROR</div>)
          setResult()
          setStep()
          return
        }else{
          createstep("Swap",ArrayA,ArrayB,i,swaploc)
        }
      }

      for(let j=i+1; j<ArrayA.length; j++){
        let operate = ArrayA[j][i]/ArrayA[i][i];
        if(ArrayA[j][i]===0){
          continue
        }else{
          for(let k=i; k<ArrayA[i].length; k++){
            ArrayA[j][k] = ArrayA[j][k] - ArrayA[i][k] * operate
          }
          ArrayB[j] = ArrayB[j] - ArrayB[i] * operate
          createstep("Eliminate",ArrayA,ArrayB,i,j)
        }
      }
    }
    console.log("ArrayA : ",ArrayA," ArrayB : ",ArrayB);

    let eleResult=[]
    let res = new Array(size)
    for(let i=ArrayA.length-1; i>=0; i--){
      res[i] = ArrayB[i];
      for(let j=ArrayA[i].length-1; j>=i; j--){
        if(j===i){
          res[i] = res[i] / ArrayA[i][i]
        }else{
          res[i] -= ArrayA[i][j]*res[j]
        }
      }
      res[i] = parseFloat(res[i].toFixed(6))
    }
    for(let i=0; i<res.length; i++){
      eleResult.push(<div>X{i+1}={res[i]}</div>)
    }
    setResult(<div data-testid='answer'>Answer :{eleResult}</div>)
    setStep(<div>{allstep}</div>)
    console.log(allstep);
  }
  const setInputsize=(value)=>{
    setDatainput()
    setResult()
    setStep()
    setSize(value)
  }
  return (
    <div>
      <Center>
        <h1>
          Gauss Elimination Method
        </h1>
      </Center>
      <Grid>
        <Grid.Col>
          <Group style={{width : "20%"}}>
            <Input.Wrapper label="Input Size of Matrix" required style={{width : "100%"}}>
              <NumberInput data-testid='size' onChange={(val)=>{setInputsize(val)}} value={size} min={2} size="sm" placeholder="Input Size of Matrix"/>
            </Input.Wrapper>
            <Button data-testid='createbtn' onClick={createinputFunc} fullWidth style={{marginTop : 10}}>
              Create
            </Button>
          </Group>
        </Grid.Col>
        {datainput}
      </Grid>
      {(Result!==undefined) ? <h2>{Result}</h2>: null}
      {(step!==undefined) ? <div>{step}</div>: null}
    </div>
  )
}

export default L2_GEliminate