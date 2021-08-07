import React from 'react';
import {AppBar, Input, makeStyles, Paper, Theme, Toolbar, Typography} from "@material-ui/core";
import {createTheme, MuiThemeProvider} from "@material-ui/core"
import {blue, green} from "@material-ui/core/colors";
import Button from "@material-ui/core/Button"

const version = "2021-08-07b"
const tmxUrl = "https://github.com/karstenwinter/GeckoKnightData/raw/main/DownloadedData/TheCave.tmx"

const fetchOpt: any = {
    method: 'no-cors',
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'omit', // include, *same-origin, omit
    headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer',
    'sec-fetch-mode': 'no-cors',
//    'Access-Control-Allow-Origin': ''
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    menuText: {
        marginRight: theme.spacing(2),
        marginTop: theme.spacing(0),
    },
    pre: {background: '#000000', color: '#ddd'},
    title: {
        flexGrow: 1,
    },
}));

function App() {

    let classes = useStyles()

    let ButtonWithColor = (props: any) =>
        <MuiThemeProvider theme={createTheme({
            palette: {
                primary: props.color,
            },
        })}>
            <Button className={classes.menuButton} variant="contained" color="primary" href="" onClick={props.onClick}
                    component={props.component}>
                {props.children}
            </Button>
        </MuiThemeProvider>


    let theme = createTheme({
        palette: {
            type: 'dark'
        }
    });
    let [tmxInput, setTmxInput] = React.useState("")
    let [input, setInput] = React.useState("")
    let [text, setText] = React.useState("")
    let [took, setTook] = React.useState("")
    let [dx, setDx] = React.useState(0)
    let [fx, setFx] = React.useState(1)
    let [dy, setDy] = React.useState(1)
    let [fy, setFy] = React.useState(-1)

    let convertTmx = (xml: string) => {
        if (xml === undefined)
            return undefined

        const lines = xml.replace("\r", "").split("\n")
        let start = lines.findIndex(x => x.includes("<layer name=\"Objects"))
        let end = lines.findIndex((x, i) => i > start && x.includes("</data>"))

        const objLines = lines.slice(start + 2, end)
        const objCsv = objLines.map(x => x.split(","))
        return objCsv
    }
    let parseTmx = (xml: string) => {
        console.log("xml", xml)
        const objCsv = convertTmx(xml)
        parse(input, objCsv)
        console.log("objects layer", objCsv?.join("\n"))
    }
    let parse = (input: string, objCsv: string[][] | undefined = undefined) => {
        const time = new Date().getTime()
        console.log("parsing savefile with: fx,dx,fy,dy:" + fx + "," + dx + "," + fy + "," + dy)
        const profile = JSON.parse(input)
        const allPos = profile?.collected?.map((id: string) => {
            if (!id.startsWith("px"))
                return undefined
            let parts = id.split("y")
            // px240y-311
            return {
                x: dx + fx * parseInt(parts[0]?.substring(2)),
                y: dy + fy * parseInt(parts[1])
            }
        }).filter((x: any) => !!x)
        //console.log(allPos)
        const shells = "221 222 223 224 225".split(' ')
        const html = profile?.map?.map((row: string, y: number) => row.split("")
            .map((col, x: number) => {
                const inTmx = objCsv && objCsv[y - 1] && shells.includes(objCsv[y - 1][x])
                const inSave = allPos.find((p: any) => p.x === x && p.y === y)
                return inSave ? "<span style='background: green'>S</span>" : inTmx ? "<span style='background: red'>S</span>" : col
            }).join("")
        )?.join("\n")
        const took = new Date().getTime() - time
        setTook(took / 1000.0 + "sec")
        setText(html)
    }
    //let hr = window.location.href || "";
    return (<MuiThemeProvider theme={theme}>
        <div className={classes.root}
             style={{minHeight: '100vh', backgroundColor: '#000000', color: "#ffffff"}}>
            <div>
                <div>
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
                    <Typography className={classes.menuText} component="span">Gecko Knight Viewer
                        v{version}</Typography>
                    {/*<ButtonWithColor color={green} onClick={() => {
                        fetch(tmxUrl, fetchOpt)
                            .then(x => x.text())
                            .then(parseTmx)
                    }}>
                        Fetch Tilemap
                    </ButtonWithColor>*/}
                    <ButtonWithColor color={green}
                                     variant="contained"
                                     component="label">
                        Open Tilemap.tmx
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
                                    console.log("tmx", text)
                                    setTmxInput(text)
                                    parseTmx(text)
                                }
                                //reader.onerror = x => console.log("onerror: ", x);
                            }
                        }}
                        />
                    </ButtonWithColor>
                    <ButtonWithColor color={blue}
                                     variant="contained"
                                     component="label">
                        Open Profile.json
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
                                    parse(text, convertTmx(tmxInput))
                                }
                                //reader.onerror = x => console.log("onerror: ", x);
                            }
                        }}
                        />
                    </ButtonWithColor>
                    <Typography className={classes.menuText} component="span">{took === "" ? "" : took}</Typography>
                </div>
            </div>

            <pre className={classes.pre} dangerouslySetInnerHTML={{__html: text}}/>
        </div>
    </MuiThemeProvider>)
}

export default App;
