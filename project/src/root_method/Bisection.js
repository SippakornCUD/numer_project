import React, { useState } from "react";
import { Center, Input, Grid, Button, Table, Group } from "@mantine/core";
import { evaluate } from 'mathjs';
import { Chart } from "react-google-charts"
import axios from "axios";
// import { addStyles, EditableMathField } from 'react-mathquill'

function Bisection(){

    const [fx , setFx] = useState('');
    const [ixl , setXl] = useState();
    const [ixr , setXr] = useState();
    const [variable , setVariable] = useState('');
    const [result , setResult] = useState();
    const [datatable, setDatatable] = useState();
    const [chart, setChart] = useState();
    let alldata =[];
    let allerror =[];
    let showdata =[];
    let charterror =[];
    let all_location =[0];
    let nowlocation = 0;
    let MaxError =0.00001;
    let itemloop = 100;
    
    const ran =()=>{
        let num = Math.floor(Math.random()*10)%5+1
        let body ={
            name : "bisection",
            RanNum : num
        }
        console.log(num);
        axios.post("http://localhost:3001/get",body).then((res)=>{
            console.log(res);
            setFx(res.data.equation)
            setVariable(res.data.variable)
            setXl(res.data.xl)
            setXr(res.data.xr)
        })
    }

    const updatedb =()=>{
        // console.log(fx,variable,ixl,ixr);
        // console.log(new Date().toISOString());
        let UTCdate = new Date().toUTCString()+"-7"
        console.log(UTCdate);
        let date = new Date(UTCdate).toISOString()
        console.log(date);
        date = date.replace('T',' ')
        date = date.replace(/\.\w*/g,'')
        let body ={
            name : 'Bisection',
            queryStr : `UPDATE Bisection SET equation='${fx}', variable='${variable}', xl=${ixl}, xr=${ixr}, date='${date}'`,
        }
        // console.log(body.query);
        axios.post('http://localhost:3001/update',body)
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
    const convertnum  = (inputvalue) =>{
        const regex1 = /[^0-9.-]/g;
        let num = inputvalue.replace(regex1, '');
        return num
    }
    const inputfx = (e) =>{
        let varia = findvar(e.target.value).toLowerCase();
        console.log("xvar :",varia);
        if(varia.length > 0){
            setVariable(varia[0])
        }else{
            setVariable()
        }
        let func2 = e.target.value.replace(/ /g, '');
        func2=func2.toLowerCase();
        console.log(func2);
        setFx(func2)
    }
    const inputxl = (e) =>{
        console.log("convert num",convertnum(e.target.value));
        let val = parseFloat(convertnum(e.target.value))
        // console.log(val);
        if(!isNaN(val)){
            setXl(val);
        }else{
            setXl()
        }
    }
    const inputxr = (e) =>{
        console.log("convert num",convertnum(e.target.value));
        let val = parseFloat(convertnum(e.target.value))
        // console.log(val);
        if(!isNaN(val)){
            setXr(val);
        }else{
            setXr()
        }
    }
    const funcCal = (value) =>{
        let Arr4Evaluate = [];
        let res;
        Arr4Evaluate.push(variable+'='+value);
        Arr4Evaluate.push(fx)
        res = evaluate(Arr4Evaluate)
        if(typeof res[res.length-1]==="object"){
            return res[res.length-1].im
            // console.log(res[res.length-1].im);
        }else{
            return res[res.length-1]
            // console.log(res[res.length-1]);
        }
    }

    const Bisection = (loc) =>{
        // console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")
        let xl,xr,xm,i,xo,err,max;
        let obj;
        if(alldata[loc] === undefined){
            if(loc === 0){
                xl = ixl;
                xr = ixr;
                i = 0;
                max = i+itemloop;
                xm = (xl+xr)/2;
                obj = {
                    iter : i+1,
                    xl : xl,
                    xm : xm,
                    xr : xr,
                    err : undefined,
                }
                alldata.push(obj);
                showdata.push(obj)
                i++;
            }else{
                xl = alldata[loc-1].xl;
                xr = alldata[loc-1].xr;
                i = parseFloat(alldata[loc-1].iter);
                max = i+itemloop;
                xm = alldata[loc -1].xm
            }
            // console.log("i : ",i,"max : ",max);
            // console.log("Error : ",chartdata.length);
            do{
                xo = xm;
                if(funcCal(xm)*funcCal(xr)>0){
                    xr = xm
                }else{
                    xl = xm
                }
                xm = (xl+xr)/2;
                
                err = Math.abs((xm-xo)/xm)*100;
                // chartdata.push([i,xo,xm,err]);
                allerror.push([(i+1),err]);
                charterror.push([(i+1),err]);
                
                obj ={
                    iter : i+1,
                    xl : xl,
                    xm : xm,
                    xr : xr,
                    err : err,
                }
                alldata.push(obj);
                showdata.push(obj)
                // console.log("i :",i," xl :",xl," xo : ",xo," xm : ",xm," xr :",xr,"err :",err);
                i++;
                
            }while(err > MaxError && i < max);
            all_location.push(alldata[alldata.length-1].iter);
        }
        else{
            i = loc 
            max = i + itemloop
            console.log("allerror : ",allerror);
            console.log("i : ",i," max : ",max);
            do{
                
                if(i===0){
                    err = allerror[i][1]
                }else{
                    charterror.push(allerror[i-1])
                    err = allerror[i-1][1]
                }
                console.log("i : ",i," err : ",err," allerror : ",allerror);
                showdata.push(alldata[i])
                console.log("i : ",i," showdata : ",alldata[i]);
                i++
            }while(err > MaxError && i < max)
        }
        nowlocation+=1;
        setResult(alldata[alldata.length-1].xm.toFixed(6));
        // console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")
    }

    const createTable= () =>{
        setDatatable(
            <div>
            <Table striped withBorder>
                <thead>
                    <tr>
                        <th>Iteration</th>
                        <th>{variable.toUpperCase()+"L"}</th>
                        <th>{variable.toUpperCase()+"M"}</th>
                        <th>{variable.toUpperCase()+"R"}</th>
                        <th>Error</th>
                    </tr>
                </thead>
                <tbody>
                {
                    showdata.map((ele) =>{
                        return(
                            <tr>
                                <td>{ele.iter}</td>
                                <td>{ele.xl}</td>
                                <td>{ele.xm}</td>
                                <td>{ele.xr}</td>
                                <td>{ele.err}</td>
                            </tr>
                        );
                    })
                }
                </tbody>
            </Table>
            <Center>
                {(all_location[nowlocation] > itemloop) ? <Button onClick={() => {MoreCal("previous")}}>&lt;&lt;&lt; Load Previous Data</Button> : null}
                {(charterror[charterror.length-1][1] > MaxError) ? <Button onClick={() => {MoreCal("next")}}>Load More Data &gt;&gt;&gt;</Button> : null}
            </Center>
            <Center style={{marginTop:"2%"}} >
                {(allerror[allerror.length-1][1] < MaxError)? <Button onClick={updatedb} fullWidth>ADD TO DataList</Button> : null}
            </Center>
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
    
    const createChart = () =>{
        setChart(
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
                nowlocation -=2;
            }
            showdata = [];
            charterror = [['Iteration | Xnew','Error']]
            Bisection(all_location[nowlocation])
            createTable();
            createChart();
        }
    }

    const Cal = (loc) =>{
        if(variable!==undefined && ixl !== undefined && ixr !== undefined){
            allerror = []
            charterror = [['Iteration | Xnew','Error']]
            Bisection(loc)
            createTable();
            createChart();
        }
    }

    return(
        <div>
            <Center>
                <h1>
                    Bisection Method
                </h1>
            </Center>
            <Grid>
                <Grid.Col span={4}>
                        <Input.Wrapper label="Input f(x)" required>
                            <Input size="sm" placeholder="Input f(x)" value={fx} onChange={inputfx}/>
                        </Input.Wrapper>
                        <Group noWrap>
                            <Input.Wrapper label="Input Xl" required>
                                <Input size="sm" placeholder="Input Xl" value={ixl} onChange={inputxl}/>
                            </Input.Wrapper>
                            <Input.Wrapper label="Input Xr" required>
                                <Input size="sm" placeholder="Input Xr" value={ixr} onChange={inputxr}/>
                            </Input.Wrapper>
                        </Group>

                    <Button onClick={() =>{Cal(0)}} fullWidth style={{marginTop : 10}}>
                        Calculate
                    </Button>
                    <Button onClick={ran} fullWidth style={{marginTop : 10}}>
                        Random
                    </Button>
                </Grid.Col>
            </Grid>
            {(result!==undefined) ? <h2>Answer : {result}</h2> : null}
            {datatable}
            {chart}
        </div>
    );
}
export default Bisection;