import { Center, Grid, Group, Container, Input, NumberInput, Button } from '@mantine/core'
import React, { useState } from 'react'

const L8_GSeidel = () => {
  const [ size, setSize ] = useState(2)
  const [ datainput, setDatainput ] = useState()
  let listA=[]
  let listB=[]
  let listX=[]
  let ArrayA=[]
  let ArrayB=[]
  let ArrayX=[]
  

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
      listX.push( <Group noWrap>
                    <NumberInput id={"X"+i} precision={6} hideControls removeTrailingZeros style={{width : "70px"}} />
                  </Group>)
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
          <Container>
            Input X :
            {listX}
          </Container>
        </Group>
        <Button onClick={Calfunc} fullWidth style={{marginTop:20}}>
          Calculate
        </Button>
      </div>
    )
  }
  const createinputFunc=()=>{
    createinput()
    showinput()
  }

  const createMatrix =()=>{
    ArrayA=[]
    ArrayB=[]
    ArrayX=[]
    for(let i=0; i<size; i++){
      for(let j=0; j<size; j++){
        
      }
    }
  }
  const Calfunc =()=>{
    createMatrix()
  }
  const setInputsize=(value)=>{
    setDatainput()
    setSize(value)
  }
  return (
    <div>
      <Center>
        <h1>
          Gauss Seidel Method
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
    </div>
  )
}

export default L8_GSeidel