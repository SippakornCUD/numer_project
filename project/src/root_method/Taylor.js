import React, { useState } from "react";
import { Center, Grid, Input, Button, Group, Table, NumberInput } from "@mantine/core";
import { derivative, evaluate, factorial, string } from "mathjs";
import Chart from "react-google-charts";


function Taylor(){

    const [ fx, setFx ] = useState('');
    const [ variable, setVariable] = useState();
    const [ variaX, setX] = useState();
    const [ variaX0, setX0] = useState();
    const [ variaN, setN] = useState();
    const [ result, setResult] = useState();
    const [ datatable, setDatatable] = useState();
    const [ datachart, setDatachart] = useState();
    let alldata=[];
    let showdata = [];
    let allerror =[];
    let charterror =[];
    let itemloop = 100;
    let MaxError = 0.00001;
    let all_location = [0];
    let nowlocation = 0;

    const findvar = (inputfunc) =>{
        const regex1 = / /g;
        let strfunc = inputfunc.replace(regex1, '');
        const regex2 = /[a-zA-Z][a-zA-Z]+/g;
        strfunc = strfunc.replace(regex2, '');
        const regex3 = /[^a-zA-Z]/g;
        strfunc = strfunc.replace(regex3, '');
        strfunc = strfunc.replace('e', '');
        return strfunc;
    }
    const inputfx = (e) => {
        let varia = findvar(e.target.value).toLowerCase()
        console.log(varia)

        if(varia.length > 0){
            setVariable(varia[0])
        }else{
            setVariable()
        }
        let func2 = e.target.value.replace(/ /g, '');
        func2=func2.toLowerCase();
        setFx(func2)
    }
    const calfunc = (func,value) =>{
        let Arr4Evaluate=[]
        let res
        Arr4Evaluate.push(variable+'='+value)
        Arr4Evaluate.push(func)
        res = evaluate(Arr4Evaluate)
        console.log("res : ",res);
        if(typeof res[res.length-1] === "object"){
            return res[res.length-1].im
        }else{
            return res[res.length-1]
        }
    }
    const TaylorCal = (loc) =>{
        let obj,err,derifunc,sum,i,max,valuederi;
        let realErr = calfunc(fx,variaX)
        if(alldata[loc] === undefined){
            if(loc === 0){
                i = 0
                max = i+itemloop
                derifunc = fx
                sum = 0
            }else{
                i=alldata[loc-1].iter
                max=i+itemloop
                derifunc=alldata[loc-1].deriverfx
                sum = alldata[loc-1].Fx
            }
            do{
                valuederi = calfunc(derifunc,variaX0)
                sum = sum + (Math.pow((variaX-variaX0),i)/factorial(i))*valuederi;
                derifunc = string(derivative(derifunc,variable))
                err = Math.abs((realErr-sum)/realErr);
                obj={
                    iter : i+1,
                    deriverfx : derifunc,
                    Fx : sum,
                    realErr : realErr,
                    err : err,
                }
                alldata.push(obj);
                showdata.push(obj)
                allerror.push([i+1,err])
                charterror.push([i+1,err])
                i++
            }while(err > MaxError && derifunc !=="0" && i < variaN && i < max)
            all_location.push(alldata[alldata.length-1].iter)
        }else{
            i=loc
            max=i+itemloop
            do{
                err=allerror[i][1]
                charterror.push(allerror[i])
                showdata.push(alldata[i])
                i++
            }while(err > MaxError && derifunc !=="0" && i < variaN && i < max)
        }
        nowlocation+=1;
        setResult(alldata[alldata.length-1].Fx)
    }
    const createTable = () =>{
        setDatatable(
            <div>
            <Table striped withBorder>
                <thead>
                    <tr>
                        <th>Iteration</th>
                        <th>Derivative Function</th>
                        <th>{"Value F"+variable.toLowerCase()}</th>
                        <th>Real Error</th>
                        <th>Error</th>
                    </tr>
                </thead>
                <tbody>
                {
                    showdata.map((ele) =>{
                        return(
                            <tr>
                                <td>{ele.iter}</td>
                                <td>{ele.deriverfx}</td>
                                <td>{ele.Fx}</td>
                                <td>{ele.realErr}</td>
                                <td>{ele.err}</td>
                            </tr>
                        );
                    })
                }
                </tbody>
            </Table>
            <Center>
                {(all_location[nowlocation]>itemloop)? <Button onClick={() => {MoreCal("previous")}}>Load Previous Data</Button> : null}
                {(charterror[charterror.length-1][1] > MaxError && all_location[nowlocation] < variaN)? <Button onClick={() => {MoreCal("next")}}>Load More Data</Button> : null}
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
    const createChart = () =>{
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
        if(variable !== undefined){
            if(operate === "previous"){
                nowlocation -=2
            }
            showdata=[]
            charterror = [['Iteration | Xnew','Error']];
            TaylorCal(all_location[nowlocation])
            createTable()
            createChart()
        }
    }
    const Cal = (loc) =>{
        if(variable !== undefined && variaX !== undefined && variaX0 !== undefined && variaN !== undefined){
            charterror = [['Iteration | Xnew','Error']];
            TaylorCal(loc)
            createTable()
            createChart()
        }
    }

    return(
        <div>
            <Center>
                <h1>
                    Taylor Series Method
                </h1>
            </Center>
            <Grid>
                <Grid.Col span={4}>
                    <Input.Wrapper label="Input f(x)" required>
                        <Input onChange={inputfx} size="sm" placeholder="Input f(x)" />
                    </Input.Wrapper>

                    <Group noWrap>
                        <Input.Wrapper label="Input X">
                            <NumberInput onChange={setX} value={variaX} precision={6} size="sm" placeholder="Input X"/>
                        </Input.Wrapper>
                        <Input.Wrapper label="Input X0">
                            <NumberInput onChange={setX0} value={variaX0} precision={6} size="sm" placeholder="Input X0"/>
                        </Input.Wrapper>
                        <Input.Wrapper label="Input N">
                            <NumberInput onChange={setN} value={variaN} min={1} precision={6} size="sm" placeholder="Input N"/>
                        </Input.Wrapper>
                    </Group>
                    <Button onClick={()=>{Cal(0)}} fullWidth style={{marginTop : 20}}>
                        Calculate
                    </Button>
                </Grid.Col>
            </Grid>
            {(result!==undefined) ? <h2>Answer : {result}</h2> : null}
            {datatable}
            {datachart}
        </div>
    );
}
export default Taylor;