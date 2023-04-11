import { Button } from '@mantine/core'
import React, { useState } from 'react'
import axios from 'axios'

const Test = () => {
  const [ datatest, setDatatest ] = useState()

  const axitest =()=>{
    let str
    if(datatest === undefined){
      str=''
    }else{
      str = datatest;
    }
    
    console.log(str);
    console.log("axios_test");
    axios.get('http://localhost:3001/getequa').then((res)=>{
      console.log("res",res);
      // str+=res.data;
      // setDatatest(str)
    })
  }
  return (
    <div>
      {(datatest !== undefined)? <h2>{datatest}</h2>:null}
      <Button onClick={axitest}>Click Me</Button>
    </div>
  )
}

export default Test

// const funcCal = (value) =>{
//   let Arr4Evaluate = [];
//   let res;
//   Arr4Evaluate.push(variable+'='+value);
//   Arr4Evaluate.push(fx)
//   res = evaluate(Arr4Evaluate)
//   if(typeof res[res.length-1]==="object"){
//       return res[res.length-1].im
//   }else{
//       return res[res.length-1]
//   }
// }
// const False_position = (xl,xr) =>{
//   let xm,i,xo,err,max;
//   let fxl,fxr;
//   fxl = funcCal(xl)
//   fxr = funcCal(xr)
//   x1 = ((xl*fxr)-(xr*fxl))/(fxr-fxl)
//   i = 0;
//   max=100;
//   let MaxError = 0.00001
//   xm = (xl+xr)/2;
//       do{
//           xo = xm;
//           if(funcCal(xm)*funcCal(xr)>0){
//               xr = xm
//           }else{
//               xl = xm
//           }
//           xm = (xl+xr)/2;
          
//           err = Math.abs((xm-xo)/xm)*100;
//           i++;
//       }while(err > MaxError && i < max);
//   return xm
// }