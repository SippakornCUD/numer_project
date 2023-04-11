import React, { useState } from "react";
import { Center, Grid, Group, Input, NumberInput, Button, Table } from "@mantine/core";
import { evaluate } from "mathjs";
import Chart from "react-google-charts";
import axios from "axios";


function OnePoint(){

    const [gx, setGx] = useState('')
    const [valueX, setX] = useState()
    const [variaGx, setVariagx] = useState()
    const [datatable, setDatatable] = useState()
    const [chartdata, setChartdata] = useState()
    const [result, setResult] = useState()
    let alldata = [];
    let showdata = [];
    let allerror = [];
    let charterror = []
    let all_location = [0]
    let nowlocation = 0;
    let MaxError = 0.00001;
    let itemloop = 100;

    // const ran = ()=>{
    //     let num = Math.floor(Math.random()*10)%5+1
    //     let body={
    //         name : "OnePoint",
    //         RanNum : num
    //     }
    //     axios.post('http://localhost:3001/get',body).then((res)=>{
    //         console.log(res);
    //     })
    // }
    const convertfunc = (inputfunc) =>{
        const regex1 = / /g;
        let strfunc = inputfunc.replace(regex1, '');
        const regex2 = /[a-zA-Z][a-zA-Z]+/g;
        strfunc = strfunc.replace(regex2, '');
        const regex3 = /[^a-zA-Z]/g
        strfunc = strfunc.replace(regex3, '');
        strfunc = strfunc.replace('e', '');
        return strfunc
    }
    const inputgx = (e) => {
        let varia = convertfunc(e.target.value).toLowerCase()
        console.log(varia)

        if(varia.length > 0){
            setVariagx(varia[0])
        }else{
            setVariagx()
        }
        let func = e.target.value.replace(/ /g, '');
        func=func.toLowerCase();
        setGx(func)
    }

    const calfunc = (value) =>{
        let Arr4Evaluate = [];
        let res
        Arr4Evaluate.push(variaGx+"="+value)
        Arr4Evaluate.push(gx)
        res = evaluate(Arr4Evaluate)
        console.log("res : ",res[res.length-1]);
        if(typeof res[res.length-1] === "object"){
            console.log("obj");
            return res[res.length-1].im
        }else{
            console.log("not obj");
            return res[res.length-1]
        }
    }

    const OneP = (loc) =>{
        let xn,err,xo,i,max
        let obj
        if(alldata[loc]===undefined){
            if(loc === 0){
                xn = valueX
                i = 0
                max = i +itemloop
            }else{
                xn = alldata[loc-1].xnew
                i = parseFloat(alldata[loc-1].iter)
                max = i + itemloop
            }
            do{
                xo = xn
                console.log("xn : ",xn);
                xn = calfunc(xn)
                console.log("xn : ",xn);
                err = Math.abs((xn-xo)/xn)*100;
                obj = {
                    iter : i+1,
                    xold : xo, 
                    xnew : xn,
                    err : err
                }
                alldata.push(obj);
                showdata.push(obj);
                allerror.push([i+1,err])
                charterror.push([i+1,err])
                i++;
                
            }while(err > MaxError && i < max)
            all_location.push(alldata[alldata.length-1].iter)
        }else{
            i = loc
            max = i + itemloop
            console.log("i : ",i," max : ",max);
            do{
                err = allerror[i][1]
                charterror.push(allerror[i])
                showdata.push(alldata[i])
                i++;
            }while(err > MaxError && i < max)
        }
        nowlocation += 1;
        setResult(alldata[alldata.length-1].xnew.toFixed(6))
    } 

    const createTable = () => {
        setDatatable(
            <div>
            <Table striped withBorder>
                <thead>
                    <tr>
                        <th>Iteration</th>
                        <th>{variaGx.toUpperCase()+"Old"}</th>
                        <th>{variaGx.toUpperCase()+"New"}</th>
                        <th>Error</th>
                    </tr>
                </thead>
                <tbody>
                {
                    showdata.map((ele) =>{
                        return(
                            <tr>
                                <td>{ele.iter}</td>
                                <td>{ele.xold}</td>
                                <td>{ele.xnew}</td>
                                <td>{ele.err}</td>
                            </tr>
                        );
                    })
                }
                </tbody>
            </Table>
            <Center>
                {(all_location[nowlocation]>itemloop)? <Button onClick={() => {MoreCal("previous")}}>&lt;&lt;&lt; Load Previous Data</Button> : null}
                {(charterror[charterror.length-1][1] > MaxError)? <Button onClick={() => {MoreCal("next")}}>Load More Data &gt;&gt;&gt;</Button> : null}
            </Center>
            <Center style={{marginTop:"2%"}} >
                {(allerror[allerror.length-1][1] < MaxError)? <Button fullWidth>ADD TO DataList</Button> : null}
            </Center>
            </div>
        )
    }
    const options={
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
        setChartdata(
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
        if(variaGx !==undefined){
            if(operate === "previous"){
                nowlocation -=2
            }
            showdata = []
            charterror = [['Iteration | Xnew','Error']];
            OneP(all_location[nowlocation])
            createTable()
            createChart()
        }
    }
    const Cal = (loc) =>{
        if(variaGx !==undefined && valueX !== undefined){
            // allerror = [];
            charterror = [['Iteration | Xnew','Error']];
            OneP(loc)
            // console.log("showdata",showdata);
            // console.log("charterror",charterror);
            createTable()
            createChart()
        }
    }
    return(
        <div>
            <Center>
                <h1>
                    One-Point Method
                </h1>
            </Center>
            <Grid>
                <Grid.Col span={4}>
                    <Input.Wrapper label="Input g(x)" required>
                        <Input onChange={inputgx} size="sm" placeholder="Input g(x)" />
                    </Input.Wrapper>
                    <Center>{(variaGx) ? variaGx.toUpperCase()+" = "+gx:null}</Center>

                    <Group noWrap>
                        <Input.Wrapper label="Input X0">
                            <NumberInput onChange={setX} value={valueX} precision={6} size="sm" placeholder="Input X" removeTrailingZeros/>
                        </Input.Wrapper>
                        <Button onClick={() => {Cal(0)}} fullWidth style={{marginTop : 25}}>
                            Calculate
                        </Button>
                        <Button /*onClick={ran}*/ fullWidth style={{marginTop : 25}}>
                            Random
                        </Button>
                    </Group>

                </Grid.Col>
            </Grid>
            {(result!==undefined) ? <h2>Answer : {result}</h2> : null}
            {datatable}
            {chartdata}
        </div>
    );
}
export default OnePoint;