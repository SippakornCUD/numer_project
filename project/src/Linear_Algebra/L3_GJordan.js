import { Center, Grid, Group, Input, NumberInput, Button, Container} from '@mantine/core'
import React, { useState } from 'react'
import { multiply } from 'mathjs'

const L3_GJordan = () => {
  const [ datainput, setDatainput ] = useState()
  const [ size, setSize ] = useState(2)
  const [ result, setResult ] = useState()
  let ArrayA=[]
  let ArrayB=[]
  let listA=[]
  let listB=[]

  const createinput = () =>{
    listA=[]
    listB=[]
    for(let i=0; i<size; i++){
      let row =[]
      for(let j=0; j<size; j++){
        row.push(<NumberInput id={"A"+i+"_"+j} /*onChange={(value)=>{arrinput("A",i,j,value)}}*/ precision={6} removeTrailingZeros hideControls style={{width : "70px"}} />)
      }
      listA.push(<Group noWrap>{row}</Group>)
      listB.push(<NumberInput id={"B"+i} /*onChange={(value)=>{arrinput("A",i,j,value)}}*/ precision={6} removeTrailingZeros hideControls style={{width : "70px"}} />)
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
        <Button onClick={()=>{console.log(ArrayA," : ",ArrayB)}} fullWidth style={{marginTop : 20}}>
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
      let row=[]
      for(let j=0; j<size; j++){
        let valueA = parseFloat(document.getElementById("A"+i+"_"+j).value)
        if(isNaN(valueA) || valueA ===""){
          row.push(0)
        }else{
          row.push(valueA)
        }
      }
      ArrayA.push(row)
      let valueB = parseFloat(document.getElementById("B"+i).value)
      if(isNaN(valueB) || valueB ===""){
        ArrayB.push(0)
      }else{
        ArrayB.push(valueB)
      }
    }
    // console.log("ArrayA : ",ArrayA, " ArrayB : ",ArrayB);
  }
  const Cal=()=>{
    let check;
    for(let i=0; i<ArrayA.length; i++){
      if(ArrayA[i][i]===0){
        check=true;
        for(let j=i+1; j<ArrayA.length; j++){
          // console.log("i : ",i," j : ",j," ArrayA[j][i] : ",ArrayA[j][i]);
          if(ArrayA[j][i]!==0){
            [ArrayA[i], ArrayA[j]] = [ArrayA[j], ArrayA[i]];
            [ArrayB[i], ArrayB[j]] = [ArrayB[j], ArrayB[i]];
            // console.log("i : ",i," j : ",j);
            check=false;
            break;
          }
        }
        if(check){
          setDatainput(<div>ERROR</div>)
          setResult()
          return
        }
      }
      
      for(let j=i+1; j<ArrayA.length; j++){
        let operate = ArrayA[j][i]/ArrayA[i][i]
        for(let k=i; k<ArrayA[j].length; k++){
          ArrayA[j][k] -= ArrayA[i][k] * operate
        }
        ArrayB[j]-= ArrayB[i] * operate
      }
    }
    // console.log("ArrayA : ",ArrayA," ArrayB : ",ArrayB);
    for(let i=0; i<ArrayA.length; i++){
      let mainvalue = ArrayA[i][i]
      for(let j=i; j<ArrayA[i].length; j++){
        ArrayA[i][j] = ArrayA[i][j] / mainvalue
        // console.log("i : ",i," j : ",j," ArrayA[i][j] : ",ArrayA[i][j]);
      }
      ArrayB[i] = ArrayB[i] / mainvalue
      // console.log("i : ", i,"ArrayB[i] : ",ArrayB[i]);

    }
    for(let i = ArrayA.length-1; i>=0; i--){
      for(let j= i-1; j>=0; j--){
        let operate = ArrayA[j][i];
        ArrayA[j][i] = ArrayA[j][i] - operate
        ArrayB[j] = ArrayB[j] - ArrayB[i]*operate
      }
    }
    let res=[]
    for(let i=0; i<ArrayB.length; i++){
      res.push(<div>X{i+1}={parseFloat(ArrayB[i].toFixed(6))}</div>)
    }
      
    setResult(<div>{res}</div>)

    // let tempA=[]
    // for(let i=0; i<size; i++){
    //   let row=[]
    //   for(let j=0; j<size; j++){
    //     let valueA = parseFloat(document.getElementById("A"+i+"_"+j).value)
    //     if(isNaN(valueA) || valueA ===""){
    //       row.push(0)
    //     }else{
    //       row.push(valueA)
    //     }
    //   }
    //   tempA.push(row)
    // }
    // console.log(tempA);
    // console.log(multiply(tempA, res));
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
            Gauss Jordan Method
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
      {(result!==undefined) ? <h2>{result}</h2> : null}
    </div>
  )
}

export default L3_GJordan