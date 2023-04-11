import React from "react";
import { Grid } from "@mantine/core";
import Navbar from './Nav'
import Routepage from './Routepage.js'
import './App.css'

function App(){
    return(
        <div>
            <Grid>
                <Grid.Col span={2}>
                    <Navbar />
                </Grid.Col>
                <Grid.Col span={10}>
                    <Routepage />
                </Grid.Col>
            </Grid>
        </div>
    );
}
export default App;