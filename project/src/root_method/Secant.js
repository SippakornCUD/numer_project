import React, { useState } from "react";
import { Center, Grid, Group, Input, Button, NumberInput, Table } from "@mantine/core";
import { evaluate } from "mathjs";
import Chart from "react-google-charts";
//x^3-5x+1
function Secant(){
    const [ fx, setFx] = useState('')
    const [ variable, setVariable] = useState()
    const [ variaX0, setX0] = useState()
    const [ variaX1, setX1] = useState()
    const [ result, setResult] = useState()
    const [ datatable, setDatatable] = useState()
    const [ datachart, setDatachart] = useState()
    let alldata=[];
    let showdata = [];
    let allerror =[];
    let charterror =[];
    let itemloop = 100;
    let MaxError = 0.00001;
    let all_location = [0];
    let nowlocation = 0;

    const findvar = (inputfunc) =>{
        const regex1 = / /g
        let strfunc = inputfunc.replace(regex1,'');
        const regex2 = /[a-zA-Z][a-zA-Z]+/g;
        strfunc = strfunc.replace(regex2,'');
        const regex3 = /[^a-zA-Z]/g
        strfunc = strfunc.replace(regex3,'');
        strfunc = strfunc.replace('e','');
        return strfunc
    }
    const inputfx =(e)=>{
        let varia = findvar(e.target.value)
        console.log("varia : ",varia);
        if(varia.length > 0){
            setVariable(varia[0])
        }else{
            setVariable()
        }
        let func = e.target.value.replace(/ /g,'');
        func = func.toLowerCase()
        console.log("func : ",func);
        setFx(func)
    }

    const calfunc =(func,value)=>{
        let Arr4Evaluate=[]
        let res
        Arr4Evaluate.push(variable+"="+value)
        Arr4Evaluate.push(func)
        res = evaluate(Arr4Evaluate)
        if(typeof res[res.length-1] === "object"){
            return res[res.length-1].im
        }else{
            return res[res.length-1]
        }
    }
    const SecantCal=(loc)=>{
        let fx0,fx1
        let x0 = variaX0
        let x1 = variaX1
        let i=0,err,obj,xn,max;
        if(alldata[loc]===undefined){
            if(loc===0){
                x0 = variaX0
                x1 = variaX1
                i = 0
                max = i + itemloop
            }else{
                x0 = alldata[loc-1].x1
                x1 = alldata[loc-1].xnew
                i = alldata[loc-1].iter
                max = i + itemloop
            }
            do{
                fx0 = calfunc(fx,x0)
                fx1 = calfunc(fx,x1)
                xn = x1 - (fx1*(x0-x1))/(fx0-fx1)
                err = Math.abs((xn-x1)/xn)*100;
                obj={
                    iter : i+1,
                    x0 : x0,
                    fx0 : fx0,
                    x1 : x1,
                    fx1 : fx1,
                    xnew : xn,
                    err : err,
                }
                alldata.push(obj)
                showdata.push(obj)
                allerror.push([i+1,err])
                charterror.push([i+1,err])
                x0 = x1
                x1 = xn
                i++
            }while(err > MaxError && i < max)
            all_location.push(alldata[alldata.length-1].iter)
        }else{
            i = loc
            max = i + itemloop
            do{
                err = allerror[i][1]
                showdata.push(alldata[i])
                charterror.push(allerror[i])
                i++
            }while(err > MaxError && i < max)
        }
        nowlocation+=1
        console.log("alldata : ",alldata);
        console.log("showdata : ",showdata);
        console.log("allerror : ",allerror);
        console.log("charterror : ",charterror);
        setResult(alldata[alldata.length-1].xnew);
    }
    const createTable = () =>{
        setDatatable(
            <div>
            <Table striped withBorder>
                <thead>
                    <tr>
                        <th>Iteration</th>
                        <th>{variable.toUpperCase()+"0"}</th>
                        <th>{"F"+variable.toLowerCase()+"0"}</th>
                        <th>{variable.toUpperCase()+"1"}</th>
                        <th>{"F"+variable.toLowerCase()+"1"}</th>
                        <th>{variable.toUpperCase()+"n"}</th>
                        <th>Error</th>
                    </tr>
                </thead>
                <tbody>
                {
                    showdata.map((ele) =>{
                        return(
                            <tr>
                                <td>{ele.iter}</td>
                                <td>{ele.x0}</td>
                                <td>{ele.fx0}</td>
                                <td>{ele.x1}</td>
                                <td>{ele.fx1}</td>
                                <td>{ele.xnew}</td>
                                <td>{ele.err}</td>
                            </tr>
                        );
                    })
                }
                </tbody>
            </Table>
            <Center>
                {(all_location[nowlocation]>itemloop)? <Button onClick={() => {MoreCal("previous")}}>Load Previous Data</Button> : null}
                {(charterror[charterror.length-1][1] > MaxError)? <Button onClick={() => {MoreCal("next")}}>Load More Data</Button> : null}
            </Center>
            </div>
        );
    }
    const options ={
        title: 'Error',
        curveType : "function",
        legend: { 
            position: "top" ,
            alignment : 'center',
        },
        lineWidth: 3,
        pointSize: 6,
    }
    const createChart =()=>{
        setDatachart(
            <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={charterror}
                options={options}
            />
        )
    }
    const MoreCal = (operate) =>{
        if(variable!==undefined){
            if(operate === "previous"){
                nowlocation-=2;
            }
            showdata=[]
            charterror = [['Iteration | Xnew','Error']];
            SecantCal(all_location[nowlocation])
            createTable()
            createChart()
        }
    }
    const Cal = (loc)=>{
        if(variable !== undefined && variaX0 !== undefined && variaX1 !== undefined){
            charterror = [['Iteration | Xnew','Error']];
            SecantCal(loc)
            createTable()
            createChart()
        }
    }
    return(
        <div>
            <Center>
                <h1>
                    Secant Method
                </h1>
            </Center>
            <Grid>
                <Grid.Col span={4}>
                    <Input.Wrapper label="Input f(x)" required>
                        <Input onChange={inputfx} size="sm" placeholder="Input f(x)" />
                    </Input.Wrapper>

                    <Group noWrap>
                        <Input.Wrapper label="Input X0">
                            <NumberInput onChange={setX0} value={variaX0} precision={6} size="sm" placeholder="Input X0"/>
                        </Input.Wrapper>
                        <Input.Wrapper label="Input X1">
                            <NumberInput onChange={setX1} value={variaX1} precision={6} size="sm" placeholder="Input X1"/>
                        </Input.Wrapper>
                        
                    </Group>
                    <Button onClick={()=>{Cal(0)}} fullWidth style={{marginTop : 20}}>
                        Calculate
                    </Button>
                    {/* <Button onClick={Cal} fullWidth style={{marginTop : 20}}>
                        Calculate
                    </Button> */}
                </Grid.Col>
            </Grid>
            {(result!==undefined) ? <h2>Answer : {result}</h2> : null}
            {datatable}
            {datachart}
        </div>
    );
}
export default Secant;