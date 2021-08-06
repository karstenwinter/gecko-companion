import React from 'react';
import {Input, Paper} from "@material-ui/core";
import red from '@material-ui/core/colors/red';
import {createTheme, MuiThemeProvider} from "@material-ui/core"
import {blue} from "@material-ui/core/colors";
import Button from "@material-ui/core/Button"

export let ButtonWithColor = (props: any) =>
    <MuiThemeProvider theme={createTheme({
        palette: {
            primary: props.color,
        },
    })}>
        <Button variant="contained" color="primary" href="" onClick={props.onClick} component={props.component}>
            {props.children}
        </Button>
    </MuiThemeProvider>;

/* eslint-disable no-unused-vars */

const settings = {
    title: 'React + Material-UI + Firebase',
    theme: {
        primaryColor: {
            name: 'blue',
            import: blue
        },
        secondaryColor: {
            name: 'red',
            import: red
        },
        type: 'dark'
    }
};

function App() {
    let theme = createTheme({
        palette: {
            primary: settings.theme.primaryColor.import,
            secondary: settings.theme.secondaryColor.import,
            type: 'dark'
        }
    });
    let [input, setInput] = React.useState("")
    let [text, setText] = React.useState("")
    let [dx, setDx] = React.useState(0)
    let [fx, setFx] = React.useState(1)
    let [dy, setDy] = React.useState(1)
    let [fy, setFy] = React.useState(1)

    let parse = (input: string) => {
        const profile = JSON.parse(input)
        const allPos = profile?.collected?.map((id: string) => {
            if (!id.startsWith("px"))
                return undefined
            let parts = id.split("y")
            // px240y-311
            return {
                x: dx + fx * parseInt(parts[0]?.substring(2)),
                y: dy + fy * parseInt(parts[1]?.substring(1))
            }
        }).filter((x: any) => !!x)
        //console.log(allPos)
        const html = profile?.map?.map((row: string, y: number) => row.split("")
            .map((col, x: number) => {
                return allPos.find((p: any) => p.x === x && p.y === y) ? "<span style='background: red'>G</span>" : col
            }).join("")
        )?.join("\n")
        setText("fx,dx,fy,dy:" + fx + "," + dx + "," + fy + "," + dy + "\n" + html)
    }
    //let hr = window.location.href || "";
    return (<MuiThemeProvider theme={theme}>
        <div style={{minHeight: '100vh', backgroundColor: theme.palette.type === 'dark' ? '#303030' : '#fafafa'}}>
            <Paper className="App">

                {/*FX
                <Input onChange={(x: any) => {
                    setFx(parseInt(x.target.value))
                    parse(input)
                }} type="number" value={fx}/>

                DX
                <Input onChange={(x: any) => {
                    setDx(parseInt(x.target.value))
                    parse(input)
                }} type="number" value={dx}/>

                FY
                <Input onChange={(x: any) => {
                    setFy(parseInt(x.target.value))
                    parse(input)
                }} type="number" value={fy}/>

                DY
                <Input onChange={(x: any) => {
                    setDy(parseInt(x.target.value))
                    parse(input)
                }} type="number" value={dy}/>*/}

                <ButtonWithColor color={blue}
                                 variant="contained"
                                 component="label">
                    Open Gecko Knight Profile.json
                    <input
                        type="file"
                        hidden onChange={(event: any) => {
                        if (event.target.files?.length > 0) {

                            //this.setState({error: "", loading: true})

                            const file = event.target.files[0]
                            const reader = new FileReader()

                            // Read file into memory as UTF-16
                            reader.readAsText(file, "UTF-8")

                            // Handle progress, success, and errors
                            //reader.onprogress = x => console.log("onprogress: ", x);
                            reader.onload = (e: any) => {
                                const text = e.target.result
                                console.log("text", text)
                                setInput(text)
                                parse(text)
                            }
                            //reader.onerror = x => console.log("onerror: ", x);
                        }
                    }}
                    />
                </ButtonWithColor>
                <pre dangerouslySetInnerHTML={{__html: text}}/>
            </Paper>
        </div>
    </MuiThemeProvider>)
}

export default App;
