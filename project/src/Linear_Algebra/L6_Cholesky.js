import { Center, Grid, Group, Container, Input, NumberInput, Button } from '@mantine/core'
import { evaluate } from 'mathjs'
import React, { useState } from 'react'

const L6_Cholesky = () => {
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
      let row=[]
      for(let j=0; j<i+1; j++){
        row.push(<NumberInput id={"A"+i+"_"+j} onChange={(Val)=>{changeValueInputIJ(i,j,Val)}} precision={6} hideControls removeTrailingZeros style={{width : "70px"}} />)
      }
      for(let j=i+1; j<size; j++){
        row.push(<NumberInput id={"A"+i+"_"+j} onChange={(Val)=>{changeValueInputIJ(i,j,Val)}} precision={6} hideControls disabled style={{width : "70px"}}/>)
      }
      listA.push(<Group noWrap>{row}</Group>)
      listB.push(<NumberInput id={"B"+i} precision={6} defaultValue={undefined} hideControls removeTrailingZeros style={{width : "70px"}} />)
    }
  }
  const changeValueInputIJ=(i,j,value)=>{
    if(value===undefined){
      document.getElementById("A"+j+"_"+i).value = ''
    }else{
      document.getElementById("A"+j+"_"+i).value = value
    }
    
  }
  const showinput=()=>{
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
        <Button onClick={Calfunc} fullWidth style={{marginTop:20}}>
          Calculate
        </Button>
      </div>
    );
  }
  const createinputFunc=()=>{
    createinput()
    showinput()
  }

  const createMatrix=()=>{
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
    console.log("ArrayA : ",ArrayA,"ArrayB : ",ArrayB);
  }
  const Cal=()=>{
    let MatrixL=[]
    let MatrixU=[]
    for(let i=0; i<ArrayA.length; i++){
      MatrixL[i]= new Array(size)
      MatrixU[i]= new Array(size)
      for(let j=0; j<ArrayA.length; j++){
        console.log(i+" : "+j);
        if(i===j){
          MatrixL[i][j]=undefined
          MatrixU[i][j]=undefined
          continue
        }else{
          if(i>j){
            MatrixL[i][j]=undefined
            MatrixU[i][j]=0
            continue
          }else{
            MatrixL[i][j]=0
            MatrixU[i][j]=undefined
          }
        }
      }
    }
    console.log("MatrixL : ",MatrixL,"MatrixU :",MatrixU);

    for(let i=0; i<MatrixL.length; i++){
      let divi;
      for(let j=i; j<MatrixL[i].length; j++){
        let sum = ArrayA[i][j]
        for(let k=0; k<MatrixL[i].length; k++){
          if(MatrixL[i][k]===0 || MatrixU[k][j]===0){
            continue
          }
          if(i===k && k===j){
            continue
          }
          if(MatrixL[i][k]===undefined || MatrixU[k][j]===undefined){
            continue
          }
          sum -= MatrixL[i][k] * MatrixU[k][j]
        }

        if(i===j){
          let value = evaluate(['x='+sum,'sqrt(x)'])
          if(typeof value[value.length-1] === 'object'){
            MatrixL[j][i] = value[value.length-1].im
            MatrixU[i][j] = value[value.length-1].im
          }else{
            MatrixL[j][i] = value[value.length-1]
            MatrixU[i][j] = value[value.length-1]
          }
          divi=MatrixL[j][i]
        }else{
          MatrixL[j][i] = sum/divi
          MatrixU[i][j] = sum/divi
        }
      }
    }
    console.log("MatrixL : ",MatrixL,"MatrixU :",MatrixU);

    let MatrixY=[]
    for(let i=0; i<MatrixL.length; i++){
      let sum = ArrayB[i]
      let divi = MatrixL[i][i]
      for(let j=0; j<i; j++){
        sum -= MatrixL[i][j] * MatrixY[j] 
      }
      MatrixY.push(sum/divi)
    }
    console.log("MatrixY : ",MatrixY);
    
    let eleResult=[]
    let res = new Array(size)
    for(let i=MatrixU.length-1; i>=0; i--){
      res[i] = MatrixY[i]
      let divi = MatrixU[i][i]
      for(let j=MatrixU[i].length-1; j>i; j--){
        if(MatrixU[i][j]!==0){
          res[i] -= MatrixU[i][j] * res[j]
        }
      }
      res[i]= parseFloat((res[i] / divi).toFixed(6))
    }
    res.map((item,i)=>{
      eleResult.push(<div>X{i+1}={parseFloat(item.toFixed(6))}</div>)
    })
    setResult(<div>{eleResult}</div>)
  }

  const Calfunc =()=>{
    createMatrix()
    Cal()
  }
  const setInputsize=(num)=>{
    setDatainput();
    setResult();
    setSize(num)
  }
  return (
    <div>
      <Center>
        <h1>
            Cholesky Method
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
      {(result!== undefined) ? <h2>{result}</h2> : null}
    </div>
  )
}

export default L6_Cholesky