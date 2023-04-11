import { Center, Grid, Group, Container, Input, NumberInput, Button } from '@mantine/core'
import { multiply } from 'mathjs'
import React, { useState } from 'react'

const L4_Matrix_Inversion = () => {
  const [ size, setSize ] =useState(2)
  const [ datainput, setDatainput ] = useState()
  const [ result, setResult ] = useState()
  let ArrayA=[]
  let MatrixA_CAL=[]
  let ArrayB=[]
  let listA=[]
  let listB=[]

  const createinput =()=>{
    listA=[]
    listB=[]
    for(let i=0; i<size; i++){
      let row=[]
      for(let j=0; j<size; j++){
        row.push(<NumberInput id={"A"+i+"_"+j} precision={6} removeTrailingZeros hideControls style={{width : "70px"}} />)
      }
      listA.push(<Group noWrap>{row}</Group>)
      listB.push(<NumberInput id={"B"+i} precision={6} removeTrailingZeros hideControls style={{width : "70px"}} />)
    }
  }
  const showinput=()=>{
    setDatainput(
      <div>
        <Group noWrap>
          <Container >
            Matrix A :
            {listA}
          </Container>
          <Container>
            Matrix B :
            {listB}
          </Container>
        </Group>
        <Button onClick={Calfunc} fullWidth style={{marginTop : 20}}>
          Calculate
        </Button>
        <Button onClick={createMatrix} fullWidth style={{marginTop : 20}}>
          createMatrix
        </Button>
        <Button onClick={()=>{console.log("ArrayA : ",ArrayA,"ArrayB : ",ArrayB)}} fullWidth style={{marginTop : 20}}>
          Log
        </Button>
      </div>
    )
  }
  const createinputFunc =()=>{
    createinput()
    showinput()
  }

  const createMatrix =()=>{
    ArrayA=[]
    ArrayB=[]
    MatrixA_CAL=[]
    for(let i=0; i<size; i++){
      ArrayA[i]=[]
      MatrixA_CAL[i]=[]
      for(let j=0; j<size; j++){
        let valueA = parseFloat(document.getElementById("A"+i+"_"+j).value)
        if(isNaN(valueA) || valueA ===""){
          ArrayA[i].push(0)
          MatrixA_CAL[i].push(0)
        }else{
          ArrayA[i].push(valueA)
          MatrixA_CAL[i].push(valueA)
        }
      }
      let valueB = parseFloat(document.getElementById("B"+i).value)
      if(isNaN(valueB) || valueB ===""){
        ArrayB.push(0)
      }else{
        ArrayB.push(valueB)
      }
    }
  }
  const Cal =()=>{
    //push Matrix I
    for(let i=0; i<ArrayA.length; i++){
      for(let j=0; j<ArrayA.length; j++){
        if(j===i){
          ArrayA[i].push(1)
        }else{
          ArrayA[i].push(0)
        }
      }
    }
    for(let i=0; i<ArrayA.length; i++){
      if(ArrayA[i][i]===0){
        let check=true
        for(let j=i+1; j<ArrayA.length; j++){
          if(ArrayA[j][i]!==0){
            [ArrayA[j], ArrayA[i]] = [ArrayA[i], ArrayA[j]];
            check=false;
            break;
          }
        }
        if(check){
          setDatainput(<div>ERROR</div>)
          setResult()
          return;
        }
      }

      for(let j=i+1; j<ArrayA.length; j++){
        let operate =  ArrayA[j][i]/ArrayA[i][i];
        for(let k=i; k<ArrayA[j].length; k++){
          ArrayA[j][k] = ArrayA[j][k] - ArrayA[i][k] * operate
          // console.log("result : "+ArrayA[j][k]);
        }
      }
    }
    for(let i=0; i<ArrayA.length; i++){
      let mainvalue = ArrayA[i][i];
      for(let j=i; j<ArrayA[i].length; j++){
        ArrayA[i][j] = ArrayA[i][j] / mainvalue;
      }
    }
    for(let i=ArrayA.length-1; i>=0; i--){
      for(let j=i-1; j>=0; j--){
        let operate = ArrayA[j][i]
        for(let k=i; k<ArrayA[j].length; k++){
          ArrayA[j][k] = ArrayA[j][k] - ArrayA[i][k]*operate
        }
      }
    }

    for(let i=0; i<size; i++){
      for(let j=0; j<size; j++){
        ArrayA[i].shift()
      }
    }
    //!!! OR !!!
    // let AInvert=[]
    // for(let i=0; i<ArrayA.length; i++){
    //   let row=[]
    //   for(let j=Math.round(ArrayA[i].length/2); j<ArrayA[i].length; j++){
    //     row.push(ArrayA[i][j])
    //   }
    //   AInvert.push(row)
    // }
    
    let res=[]
    for(let i=0; i<size; i++){
      let sum = 0;
      for(let j=0; j<size; j++){
        sum += (ArrayA[i][j] * ArrayB[j])
      }
      res.push(<div>X{i+1}={parseFloat(sum.toFixed(6))}</div>)
    }
    //OR
    // let res = multiply(ArrayA, ArrayB)
    setResult(<div>{res}</div>)
    console.log("Matrix Invertion");
    // console.log(multiply(ArrayA, MatrixA_CAL));
  }
  const Calfunc =()=>{
    createMatrix()
    Cal()
  }
  const setInputsize=(value)=>{
    setDatainput()
    setResult()
    setSize(value)
  }

  return (
    <div>
      <Center>
        <h1>
            Matrix Inversion Method
        </h1>
      </Center>
      <Grid>
        <Grid.Col>
          <Group style={{width : "20%"}}>
            <Input.Wrapper label="Input Size of Matrix" required style={{width : "100%"}}>
              <NumberInput onChange={(val)=>{setInputsize(val)}} value={size} min={2} size="sm" placeholder="Input Size of Matrix"/>
            </Input.Wrapper>
            <Button onClick={createinputFunc} fullWidth style={{marginTop : 10}}>
              Create
            </Button>
          </Group>
        </Grid.Col>
        {datainput}
      </Grid>
      {(result !== undefined) ? <h2>{result}</h2> : null}
    </div>
  )
}

export default L4_Matrix_Inversion