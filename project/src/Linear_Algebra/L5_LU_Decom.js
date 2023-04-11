import { Center, Grid, Group, Container, Input, NumberInput, Button } from '@mantine/core'
import { multiply } from 'mathjs'
import React, { useState } from 'react'

const L5_LU_Decom = () => {
  const [ size, setSize ] = useState(2)
  const [ datainput, setDatainput ] = useState()
  const [ result, setResult ] = useState()
  let ArrayA=[]
  let ArrayB=[]
  let listA=[]
  let listB=[]
  
  const createinput =()=>{
    listA=[]
    listB=[]
    for(let i=0; i<size; i++){
      let temp=[]
      for(let j=0; j<size; j++){
        temp.push(<NumberInput id={"A"+i+"_"+j} precision={6} removeTrailingZeros hideControls style={{width : "70px"}} />)
      }
      listA.push(<Group noWrap>{temp}</Group>)
      listB.push(<NumberInput id={"B"+i} precision={6} removeTrailingZeros hideControls style={{width : "70px"}} />)
    }
  }
  const showinput =()=>{
    setDatainput(
      <div>
        <Group noWrap>
          <Container>
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
        <Button onClick={()=>{console.log("ArrayA : ",ArrayA," ArrayB : ",ArrayB)}} fullWidth style={{marginTop : 20}}>
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
    for(let i=0; i<size; i++){
      ArrayA[i]=[]
      for(let j=0; j<size; j++){
        let valueA = parseFloat(document.getElementById("A"+i+"_"+j).value)
        if(isNaN(valueA) || valueA===''){
          ArrayA[i].push(0)
        }else{
          ArrayA[i].push(valueA)
        }
      }
      let valueB = parseFloat(document.getElementById("B"+i).value)
      if(isNaN(valueB) || valueB===''){
        ArrayB.push(0)
      }else{
        ArrayB.push(valueB)
      }
    }
  }

  const Cal =()=>{
    console.log("Cal")
    let MatrixL=[]
    let MatrixU=[]
    for(let i=0; i<size; i++){
      MatrixL[i]=[]
      MatrixU[i]=[]
      for(let j=0; j<size; j++){
        console.log("i : ",i," j : ",j);
        if(j===i){
          MatrixL[i].push(undefined)
          MatrixU[i].push(1)
          continue
        }
        if(j>i){
          MatrixL[i].push(0)
          MatrixU[i].push(undefined)
          continue
        }
        if(j<i){
          MatrixL[i].push(undefined)
          MatrixU[i].push(0)
        }
      }
    }
    let check=false
    for(let i=0; i<size; i++){
      for(let j=0; j<size; j++){
        let sum = ArrayA[i][j];
        let divi
        for(let k=0; k<size; k++){
          if(MatrixL[i][k] === 0 || MatrixU[k][j] ===0){
            continue
          }else{
            if(MatrixL[i][k]===undefined){
              divi = MatrixU[k][j]
              continue
            }
            if(MatrixU[k][j]===undefined){
              divi = MatrixL[i][k]
              continue
            }
            sum -= MatrixL[i][k] * MatrixU[k][j]
          }
        }
        if(i>=j){
          MatrixL[i][j] = sum/divi;
        }else{
          MatrixU[i][j] = sum/divi;
        }
      }
      if(MatrixL[i][i]===0){
        check=true
      }
    }
    if(check){
      console.log(MatrixL,MatrixU);
      setResult()
      error(MatrixL,MatrixU)
      return
    }
    console.log("MatrixL : ",MatrixL,"MatrixU : ",MatrixU);
    
    let MatrixY=[]
    for(let i=0; i<size; i++){
      let sum=ArrayB[i]
      let divi= MatrixL[i][i]
      for(let j=0; j<i; j++){
        sum -= MatrixL[i][j] * MatrixY[j]
      }
      MatrixY.push(sum/divi)
    }
    console.log(MatrixY);
    
    let res = new Array(size)
    let eleResult=[]
    for(let i=MatrixU.length-1; i>=0; i--){
      res[i]=MatrixY[i]
      let divi = MatrixU[i][i] // In LU Decomposition divi = 1
      for(let j=MatrixU.length-1; j>i; j--){
        console.log("i : ",i," j : ",j);
        console.log("MatrixU[i][j] : "+MatrixU[i][j]+" MatrixY[i] : "+MatrixY[i]);
        res[i] -= MatrixU[i][j] * res[j]
      }
    }
    for(let i=0; i<res.length; i++){
      eleResult.push(<div>X{i}={parseFloat(res[i].toFixed(6))}</div>)
    }
    
    setResult(<div>{eleResult}</div>)
    // console.log(multiply(MatrixL,MatrixU));
  }
  const Calfunc =()=>{
    createMatrix()
    Cal()
  }
  const error =(ML,MU)=>{
    // ii == 0
    let listl=[]
    let listu=[]
    for(let i=0; i<ML.length; i++){
      let temp=[]
      ML[i].map((item)=>{
        temp.push(<Input value={item.toFixed(2)} style={{width : "70px"}} disabled/>)
      })
      listl.push(<Group noWrap>{temp}</Group>)
      temp=[]
      MU[i].map((item)=>{
        temp.push(<Input value={item.toFixed(2)} style={{width : "70px"}} disabled/>)
      })
      listu.push(<Group noWrap>{temp}</Group>)
    }
    console.log(listl,listu);
    setDatainput(
      <div>
        <Group position='center'>
          !!!! ERROR !!!!
        </Group>
        <Group noWrap>
          <Container>
            Matrix L :
            {listl}
          </Container>
          <Container>
            Matrix U :
            {listu}
          </Container>
        </Group>
      </div>
    )
  }
  const setInputsize =(value)=>{
    setDatainput()
    setResult()
    setSize(value)
  }


  return (
    <div>
      <Center>
        <h1>
            LU Decomposition Method
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
      {(result!==undefined)? <h2>{result}</h2>: null}
    </div>
  )
}

export default L5_LU_Decom