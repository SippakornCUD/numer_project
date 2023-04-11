import { Center, Grid, Group, Container, Input, NumberInput, Button } from '@mantine/core'
import React, { useState } from 'react'

const L7_Jacobi = () => {
  const [ size, setSize ] = useState(2)
  const [ datainput, setDatainput ] =useState()
  const [ Result, setResult ] = useState()
  let ArrayA=[]
  let ArrayB=[]
  let ArrayX=[]
  let listA=[]
  let listB=[]
  let listX=[]
  let MaxError=0.00001

  const createinput=()=>{
    listA=[]
    listB=[]
    listX=[]
    for(let i=0; i<size; i++){
      let row=[]
      for(let j=0; j<size; j++){
        row.push(<NumberInput id={"A"+i+"_"+j} precision={6} hideControls removeTrailingZeros style={{width : "70px"}} />)
      }
      listA.push(<Group noWrap>{row}</Group>)
      listB.push(<NumberInput id={"B"+i} precision={6} hideControls removeTrailingZeros style={{width : "70px"}} />)
      listX.push(
                <Group noWrap>
                  X{i+1}: 
                  <NumberInput id={"X"+i} precision={6} hideControls removeTrailingZeros style={{width : "70px"}} />
                </Group>
                )
    }
  }
  const showinput=()=>{
    setDatainput(
      <div>
        <Group noWrap>
          <Container>
            Matrix A:
            {listA}
          </Container>
          <Container>
            Matrix B:
            {listB}
          </Container>
          <Container>
            Input X
            {listX}
          </Container>
        </Group>
        <Button onClick={Calfunc} fullWidth style={{marginTop:20}}>
          Calculate
        </Button>
      </div>
    )
  }
  const createinputFunc =()=>{
    createinput()
    showinput()
  }
  const createMatrix=()=>{
    ArrayA=[]
    ArrayB=[]
    ArrayX=[]
    for(let i=0; i<size; i++){
      ArrayA[i]=[]
      for(let j=0; j<size; j++){
        ArrayA[i].push(parseFloat(document.getElementById("A"+i+"_"+j).value))
      }
      ArrayB.push(parseFloat(document.getElementById("B"+i).value))
      ArrayX.push(parseFloat(document.getElementById("X"+i).value))
    }
    console.log("ArrayA : ",ArrayA,"ArrayB : ",ArrayB,"valueX : ",ArrayX);
  }

  const Cal=()=>{
    let valueX = new Array(size)
    for(let i=0; i<ArrayX.length; i++){
      valueX[i]=ArrayX[i]
    }
    let check;
    let count=1;
    do{
      check=false;
      for(let i=0; i<ArrayA.length; i++){
        let sum = ArrayB[i]
        for(let j=0; j<ArrayA[i].length; j++){
          if(i!==j){
            sum -= ArrayA[i][j] * valueX[j]
          }
        }
        ArrayX[i] = sum/ArrayA[i][i]
      }
      for(let i=0; i<valueX.length; i++){
        if(!check){
          let err = Math.abs((ArrayX[i] - valueX[i])/ArrayX[i])*100
          if(err > MaxError){
            check = true
            
          }
        }
        valueX[i]=ArrayX[i]
      }
      console.log("count : ",count++,"valueX : ",valueX);
    }while(check && count < 1000)
    console.log("final");
    let eleResult=[]
    valueX.map((item,idex)=>{
      eleResult.push(<div>X{idex+1}={parseFloat(item.toFixed(6))}</div>)
    })
    setResult(<div>{eleResult}</div>)
  }
  const Calfunc=()=>{
    createMatrix()
    Cal()
  }
  const setInputsize=(value)=>{
    setResult()
    setDatainput()
    setSize(value)
  }
  return (
    <div>
      <Center>
        <h1>
            Jacobi Method
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
      {(Result !== undefined) ? <h2>{Result}</h2>:null}
    </div>
  )
}

export default L7_Jacobi