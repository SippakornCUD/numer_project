import React, { useState } from "react";
import { Center, Grid, Input, NumberInput, Button, Group, Table } from "@mantine/core";
import { evaluate } from "mathjs";
import Chart from "react-google-charts";
import axios from "axios";

function FalsePosition(){

    const [fx , setFx] = useState('');
    const [ixl , setXl] = useState();
    const [ixr , setXr] = useState();
    const [variable , setVariable] = useState();
    const [result , setResult] = useState();
    const [theTable , setTheTable] = useState();
    const [theChart , setTheChart] = useState();
    let alldata = [];
    let showdata = [];
    let allerror =[];
    let charterror =[];
    let MaxError = 0.00001
    let itemloop = 100;
    let all_location = [0];
    let nowlocation = 0;

    const ran =()=>{
        let num = Math.floor(Math.random()*10)%5+1
        let body={
            name : "FalsePosition",
            RanNum : num
        }
        axios.post('http://localhost:3001/get', body).then((res)=>{
            console.log(res.data);
            setFx(res.data.equation)
            setVariable(res.data.variable)
            setXl(res.data.xl)
            setXr(res.data.xr)
        })
    }
    const updatedb=()=>{
        let UTCdate = new Date().toUTCString()+"-7"
        console.log(UTCdate);
        let date = new Date(UTCdate).toISOString()
        date = date.replace(/T/g,' ')
        date = date.replace(/\.\w*/g,'')
        let body ={
            name :"FalsePosition",
            queryStr : `UPDATE FalsePosition SET equation='${fx}', variable='${variable}', xl=${ixl}, xr=${ixr}, date='${date}'`
        }
        axios.post('http://localhost:3001/update',body)
        console.log(body.queryStr);
    }
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
        let varia = findvar(e.target.value).toLowerCase();
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

    const calfunc = (value) => {
        let Arr4Evaluate = [];
        let res;
        Arr4Evaluate.push(variable+'='+value);
        Arr4Evaluate.push(fx)
        res = evaluate(Arr4Evaluate)
        if(typeof res[res.length-1]==="object"){
            return res[res.length-1].im
        }else{
            return res[res.length-1]
        }
    }
    const False_pos = (loc) => {
        let xl,fxl,xr,fxr,x1,i,xo,err,max;
        let obj;
        if(alldata[loc] === undefined){
            if(loc === 0){
                xl = ixl
                fxl = calfunc(xl)
                xr = ixr
                fxr = calfunc(xr)
                x1 = ((xl*fxr)-(xr*fxl))/(fxr-fxl)
                i = 0
                max = i+itemloop;
                obj = {
                    iter : i+1,
                    xl : xl,
                    fxl : fxl,
                    xr : xr,
                    fxr : fxr,
                    x1 : x1,
                    err : undefined
                }
                alldata.push(obj)
                showdata.push(obj)
                i++;
            }else{
                xl = alldata[loc-1].xl
                fxl = alldata[loc-1].fxl
                xr = alldata[loc-1].xr
                fxr = alldata[loc-1].fxr
                x1 = alldata[loc-1].x1
                i = parseFloat(alldata[loc-1].iter)
                max = i + itemloop
            }
            do{
                xo = x1
                if(calfunc(x1)*calfunc(xr)>0){
                    xr = x1
                    fxr = calfunc(xr)
                }else{
                    xl = x1
                    fxl = calfunc(xl)
                }
                // console.log(calfunc(x1));
                // console.log(calfunc(xr));
                x1 = ((xl*fxr)-(xr*fxl))/(fxr-fxl)
                err = (Math.abs((x1-xo)/x1)*100)
                allerror.push([(i+1),err])
                charterror.push([(i+1),err])

                obj = {
                    iter : i+1,
                    xl : xl,
                    fxl : fxl,
                    xr : xr,
                    fxr : fxr,
                    x1 : x1,
                    err : err,
                }
                alldata.push(obj);
                showdata.push(obj)
                
                i++
            }while(err > MaxError && i < max)
            all_location.push(alldata[alldata.length-1].iter)
            // console.log(showdata);
        }else{
            i = loc
            max = i+itemloop
            console.log("i : ",i,"max : ",max);
            do{
                if(i === 0){
                    err = allerror[i][1];
                    console.log("allerror[i]",allerror[i]);
                }else{
                    charterror.push(allerror[i-1])
                    err = allerror[i-1][1];
                    // console.log(allerror[i-1]);
                }
                showdata.push(alldata[i])
                i++;
            }while(err > MaxError && i < max)
        }
        nowlocation += 1;
        setResult(alldata[alldata.length-1].x1.toFixed(6));
        // console.log("------------------start False------------------");
        // console.log(allerror);

    }
    const createTable = () => {
        setTheTable(
            <div>
            <Table striped withBorder>
                <thead>
                    <tr>
                        <th>Iteration</th>
                        <th>{variable.toUpperCase()+"L"}</th>
                        <th>{variable.toUpperCase()+"1"}</th>
                        <th>{variable.toUpperCase()+"R"}</th>
                        <th>{"F"+variable.toLowerCase()+"l"}</th>
                        <th>{"F"+variable.toLowerCase()+"r"}</th>
                        <th>Error</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        showdata.map((item) => {
                            return(
                                <tr>
                                    <td>{item.iter}</td>
                                    <td>{item.xl}</td>
                                    <td>{item.x1}</td>
                                    <td>{item.xr}</td>
                                    <td>{item.fxl}</td>
                                    <td>{item.fxr}</td>
                                    <td>{item.err}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            <Center>
            {(all_location[nowlocation] > itemloop)? <Button onClick={() => {MoreCal("previous")}}>&lt;&lt;&lt; Load Previous Data</Button> : null}
            
            {(charterror[charterror.length-1][1] > MaxError)? <Button onClick={() => {MoreCal("next")}}>Load More Data 	&gt;&gt;&gt;</Button> : null}
            
            </Center>
            <Center style={{marginTop:"2%"}} >
                {(allerror[allerror.length-1][1] < MaxError)? <Button onClick={updatedb} fullWidth>ADD TO DataList</Button> : null}
            </Center>
            {/* <a onClick={checklog} style={{cursor : "pointer"}}>Log data</a><br/>
            <a onClick={nowchecklog} style={{cursor : "pointer"}}>now data</a> */}
            </div>
        )
    }
    
    const options = {
        title: 'Error',
        curveType : "function",
        legend: { 
            position: "top" ,
            alignment : 'center',
        },
        lineWidth: 3,
        pointSize: 6,
    }
    const createChart = () => {
        setTheChart(
                <Chart 
                    chartType="LineChart"
                    width="100%"
                    height="400px"
                    data={charterror}
                    options={options}
                />
        )
    }
    const MoreCal = (operate) => {
        if(variable !== undefined){
            if(operate === "previous"){
                nowlocation -= 2;
            }
            showdata = [];
            charterror = [['Iteration | Xnew','Error']];
            False_pos(all_location[nowlocation])
            createTable()
            createChart()
        }
    }
    const Cal = (loc) => {
        if(variable !== undefined && ixl !== undefined && ixr !== undefined){
            console.log("-------------------------Cal-------------------------");
            // console.log("showdata : ",showdata);
            // console.log("nowlocation : ",nowlocation);
            // console.log("all_location : ",all_location);
            allerror = [];
            charterror = [['Iteration | Xnew','Error']];
            False_pos(loc)
            // console.log("showdata : ",showdata);
            // console.log("alldata : ",alldata,"showdata : ",showdata,"nowlocation :",nowlocation);
            createTable()
            createChart()
        }
    }

    return(
        <div>
            <Center>
                <h1>
                    False-Position Method
                </h1>
            </Center>
            <Grid>
                <Grid.Col span={4}>
                        <Input.Wrapper label="Input f(x)" required>
                            <Input size="sm" placeholder="Input f(x)" value={fx} onChange={inputfx}/>
                        </Input.Wrapper>

                        <Group noWrap>
                            <Input.Wrapper label="Input Xl" required>
                                <NumberInput onChange={setXl} value={ixl}  precision={6} size="sm" placeholder="Input Xl" removeTrailingZeros />
                            </Input.Wrapper>
                            <Input.Wrapper label="Input Xr" required>
                                <NumberInput onChange={setXr} value={ixr} precision={6} size="sm" placeholder="Input Xr" removeTrailingZeros />
                            </Input.Wrapper>
                        </Group>

                    <Button onClick={() => {Cal(0)}} fullWidth style={{marginTop : 10}}>
                        Calculate
                    </Button>
                    <Button onClick={ran} fullWidth style={{marginTop : 10}}>
                        Random
                    </Button>
                    
                </Grid.Col>
            </Grid>
            {(result!==undefined) ? <h2>Answer : {result}</h2> : null}
            {theTable}
            {theChart}
        </div>
    );
}
export default FalsePosition;