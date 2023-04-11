import { Center, Grid, Group, Input, NumberInput, Button, Container } from '@mantine/core'
import { det } from 'mathjs';
import React, { useState, useEffect } from 'react'
// import ReactDOMServer from 'react-dom/server';
import axios from 'axios';

const Cramer = () => {
  const [datainput , setDatainput] = useState();
  const [size , setSize] = useState(2);
  const [Result , setResult] = useState();
  let ArrayA = []
  let ArrayB = []

  const displayMatrix=()=>{
    let num = Math.floor(Math.random()*10)%5
    let body ={
      name :"cramer",
      size : size,
      RanNum : num
    }
    console.log(body);
    axios.post('http://localhost:3001/getMat',body).then((res)=>{
      let test = JSON.parse(res.data.matrix);
      ArrayA = test.ArrayA
      ArrayB = test.ArrayB
      for(let i=0;i<size;i++){
        for(let j=0;j<size;j++){
          document.getElementById("A"+i+"_"+j).value=ArrayA[i][j]
        }
        document.getElementById("B"+i).value=ArrayB[i]
      }
    })
  }
  const updateMatrix=()=>{
    let ArrA = []
    let ArrB = []
    for(let i=0;i<size;i++){
      ArrA[i]=[]
      for(let j=0;j<size;j++){
        ArrA[i].push(parseFloat(document.getElementById("A"+i+"_"+j).value))
      }
      ArrB.push(parseFloat(document.getElementById("B"+i).value))
    }
    let obj = {
      ArrayA : ArrA,
      ArrayB : ArrB
    }
    let UTCdate = new Date().toUTCString()+"-7"
    console.log(UTCdate);
    let date = new Date(UTCdate).toISOString()
    date = date.replace(/T/g,' ')
    date = date.replace(/\.\w*/g,'')
    let body ={
      name :"cramer",
      json : JSON.stringify(obj),
      size : size,
      // queryStr : `INSERT INTO cramer VALUES (${JSON.stringify(obj)},${size},${date});`
      queryStr : `UPDATE cramer SET matrix='${JSON.stringify(obj)}', size=${size}, date='${date}'`
    }
    console.log(body.queryStr);
    console.log(typeof obj);
    console.log(JSON.stringify(obj));
    console.log(typeof JSON.stringify(obj));
    axios.post('http://localhost:3001/updateMat',body)
  }

  const createinput=()=>{
    setDatainput()
    let listA = [];
    let listB = [];
    let temp = [];
    let row = []
    for(let i=0;i<size;i++){
      temp=[]
      row=[];
      for(let j=0;j<size;j++){
        row.push(0)
        temp.push(<NumberInput id={"A"+i+"_"+j} precision={6} removeTrailingZeros hideControls style={{width : "70px"}} />)
      }
      ArrayA.push(row)
      listB.push(<NumberInput id={"B"+i} precision={6} removeTrailingZeros hideControls style={{width : "70px", marginTop : "10px"}} />)
      ArrayB.push(0)
      listA.push(<Group noWrap style={{marginTop : 10}}>{temp}</Group>)
    }
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
        <Button onClick={calfunc} fullWidth style={{marginTop : 20}}>
          Calculate
        </Button>
        <Button onClick={displayMatrix} fullWidth style={{marginTop : 10}}>
          Random
        </Button>
        <Button onClick={updateMatrix} fullWidth style={{marginTop : 10}}>
          ADD TO Database
        </Button>
      </div>
    )
  }

  const Cal=()=>{
    console.log("ArrayA",ArrayA,"ArrayB",ArrayB);
    let temp=[]
    let VdetA = det(ArrayA);
    console.log("VdetA : ",VdetA);
    let res = []
    for(let i=0;i<ArrayA.length;i++){
      temp=[]
      for(let j=0;j<ArrayA[i].length;j++){
        temp.push(ArrayA[j][i])
        ArrayA[j][i]=ArrayB[j]
      }
      res.push(parseFloat((det(ArrayA)/VdetA).toFixed(6)))
      for(let j=0;j<ArrayA[i].length;j++){
        ArrayA[j][i]=temp[j]
      }
    }
    let eleResult = []
    for(let i=0;i<res.length;i++){
      eleResult.push(<div>X{i+1}={res[i]}</div>)
    }
    setResult(<div>Answer :{eleResult}</div>)
    console.log("eleResult : ",eleResult);
  }
  const setInputsize=(value)=>{
    setDatainput()
    setResult()
    setSize(value)
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

  return (
    <div>
      <Center>
        <h1>
          Cramer's Rule
        </h1>
      </Center>
      <Grid>
        <Grid.Col>
          <Group style={{width : "20%"}}>
            <Input.Wrapper label="Input Size of Matrix" required style={{width : "100%"}}>
              <NumberInput onChange={(val)=>{setInputsize(val)}} value={size} min={2} size="sm" placeholder="Input Size of Matrix"/>
            </Input.Wrapper>
            <Button onClick={createinput} fullWidth style={{marginTop : 10}}>
              Create
            </Button>
          </Group>
        </Grid.Col>
        {datainput}
      </Grid>
      {(Result!==undefined) ? <h2>{Result}</h2>: null}
    </div>
  )
}

export default Cramer