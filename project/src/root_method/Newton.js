import React, { useState } from "react";
import { Center, Grid, Group, Input, NumberInput, Button, Table } from "@mantine/core";
import { derivative, evaluate, string } from "mathjs";
import Chart from "react-google-charts";


function Newton(){
    const [ fx, setFx] = useState('')
    const [ variaX0, setX0] = useState()
    const [ variable, setVariable] = useState()
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
    const inputfx = (e) =>{
        let varia = findvar(e.target.value).toLowerCase()
        console.log(varia);
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

    const calfunc = (func,value) =>{
        let Arr4Evaluate=[]
        let res
        Arr4Evaluate.push(variable+'='+value)
        Arr4Evaluate.push(func)
        res = evaluate(Arr4Evaluate)
        if(typeof res[res.length-1] === "object"){
            return res[res.length-1].im
        }else{
            return res[res.length-1]
        }
    }
    const NewtonCal = (loc) =>{
        let xo,xn,err,obj;
        let valuefx,valuederi;
        let i,max;
        let derifunc
        if(alldata[loc]===undefined){
            if(loc===0){
                xn=variaX0;
                i=0;
                max = i + itemloop
            }else{
                xn = alldata[loc-1].xn;
                i = alldata[loc-1].iter
                max = i + itemloop
            }
            derifunc = string(derivative(fx,variable))
            do{
                xo = xn;
                valuefx = calfunc(fx,xn)
                valuederi = calfunc(derifunc,xn)
                xn = xn - (valuefx/valuederi)
                err = Math.abs((xn-xo)/xn)*100;
                obj={
                    iter : i+1,
                    xo : xo,
                    Fx : valuefx,
                    deriFx : valuederi,
                    xn : xn,
                    err : err,
                }
                alldata.push(obj)
                showdata.push(obj)
                allerror.push([i+1,err])
                charterror.push([i+1,err])
                i++;
            }while(err > MaxError && i < max)
            all_location.push(alldata[alldata.length-1].iter)
        }else{
            i=loc
            max = i+itemloop
            do{
                err = allerror[i][1]
                showdata.push(alldata[i])
                charterror.push(allerror[i])
                i++
            }while(err > MaxError && i < max)
        }
        nowlocation+=1;
        console.log("alldata : ",alldata);
        console.log("showdata : ",showdata);
        console.log("allerror : ",allerror);
        console.log("charterror : ",charterror);
        setResult(alldata[alldata.length-1].xn)
    }
    const createTable=()=>{
        setDatatable(
            <div>
            <Table striped withBorder>
                <thead>
                    <tr>
                        <th>Iteration</th>
                        <th>{variable.toUpperCase()+"o"}</th>
                        <th>{"Value of Function F"+variable.toLowerCase()}</th>
                        <th>{"Value of Derivative Function F"+variable.toLowerCase()}</th>
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
                                <td>{ele.xo}</td>
                                <td>{ele.Fx}</td>
                                <td>{ele.deriFx}</td>
                                <td>{ele.xn}</td>
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
    const createChart=()=>{
        setDatachart(
            <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={charterror}
                options={options}
            />
        );
    }
    const MoreCal = (operate) =>{
        if(variable!==undefined){
            if(operate === "previous"){
                nowlocation -=2
            }
            console.log("all_location : ",all_location);
            showdata=[]
            charterror = [['Iteration | Xnew','Error']];
            NewtonCal(all_location[nowlocation])
            createTable()
            createChart()
        }
    }
    const Cal = (loc) =>{
        if(variable!==undefined && variaX0 !== undefined){
            charterror = [['Iteration | Xnew','Error']];
            NewtonCal(loc)
            createTable()
            createChart()
        }
    }
    return(
        <div>
            <Center>
                <h1>
                    Newton Raphson Method
                </h1>
            </Center>
            <Grid>
                <Grid.Col span={4}>
                    <Input.Wrapper label="Input f(x)" required>
                        <Input data-testid='fx' onChange={inputfx} size="sm" placeholder="Input f(x)" />
                    </Input.Wrapper>

                    <Group noWrap>
                        <Input.Wrapper label="Input X0">
                            <NumberInput data-testid='x0' onChange={setX0} value={variaX0} precision={6} size="sm" placeholder="Input X0"/>
                        </Input.Wrapper>
                        <Button data-testid='button' onClick={()=>{Cal(0)}} fullWidth style={{marginTop : 25}}>
                            Calculate
                        </Button>
                    </Group>
                    
                </Grid.Col>
            </Grid>
            {(result!==undefined) ? <h2 data-testid='answer'>Answer : {result}</h2> : null}
            {datatable}
            {datachart}
        </div>
    );
}
export default Newton;