import React from 'react'
import { Card } from '@blueprintjs/core'
import './designer.css'

// UINODE

export interface INodeProperty {
    id: string
    parentid: string
    text: string
    pos: {
        X: number,
        Y: number,
        width: number,
        height: number
    }
    style: React.CSSProperties
    children: JSX.Element
}

export class UiNode extends React.Component<INodeProperty>{

    render() {
        return (
            <>
                <h5
                    id={this.props.id}
                    style={Object.assign({
                        gridColumnStart: this.props.pos.X,
                        gridColumnEnd: this.props.pos.X + this.props.pos.width,
                        gridRowStart: this.props.pos.Y,
                        gridRowEnd: this.props.pos.Y + this.props.pos.height
                    }, this.props.style)}>
                    {this.props.text}
                </h5>
            </>
        )

    }

}

// WORKFLOW

export class Workflow extends React.Component {
    render() {
        return (
            <>

            </>
        )
    }
}

// DESIGNER

export interface IDesignerProperty {
    Size: {
        X: number
        Y: number
    }
    Nodes: INodeProperty[]
    Dragging: {
        mouseDown: boolean
        xDown: number
        yDown: number
        id: string
        xDelta: number
        yDelta: number
    }
}

export class Designer extends React.Component<any, IDesignerProperty> {

    constructor(props: any) {
        super(props)
        this.state = {
            Size: {
                X: window.outerWidth,
                Y: window.outerHeight
            },
            Nodes: [
                {
                    style: {
                        /*gridColumnStart: "1",
                        gridColumnEnd: "2",
                        gridRowStart: "1",
                        gridRowEnd: "150",*/
                        border: "1px solid blue",
                        position: 'relative',
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        padding: "20px",
                        fontSize: "30px",
                        textAlign: "center",
                    },
                    pos: {
                        X: 1,
                        Y: 1,
                        width: 1,
                        height: 1
                    },
                    id: "Activity",
                    text: "Activity",
                    parentid: "Activity",
                    children: <></>
                },
                {
                    style: {
                        /*gridColumnStart: "50",
                        gridColumnEnd: "100",
                        gridRowStart: "50",
                        gridRowEnd: "100",*/
                        border: "1px solid blue",
                        position: 'relative',
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        padding: "20px",
                        fontSize: "30px",
                        textAlign: "center",
                    },
                    pos: {
                        X: 1,
                        Y: 1,
                        width: 1,
                        height: 1
                    },
                    id: "Activity2",
                    text: "Activity2",
                    parentid: "Activity2",
                    children: <></>
                }
            ],
            Dragging: {
                mouseDown: false,
                xDown: 0,
                yDown: 0,
                id: "",
                xDelta: 0,
                yDelta: 0
            }
        }
    }

    onClick(e: any) {
        //console.log("click!", e)
    }

    calculateXDown(raw: number): number {
        return Math.round(raw / 10)
    }

    calculateYDown(raw: number): number {
        return Math.round(raw / 10)
    }

    onMouseDown(e: any) {
        e.preventDefault()
        const X = this.calculateXDown(e.clientX)
        const Y = this.calculateYDown(e.clientY)
        this.state.Nodes.forEach((val) => {
            if (val.id === e.target.id) {
                this.setState({
                    Dragging: {
                        mouseDown: true,
                        xDown: X,
                        yDown: Y,
                        id: e.target.id,
                        xDelta: X - val.pos.X,
                        yDelta: Y - val.pos.Y
                    }
                })
            }
        })
    }

    onMouseMove(e: any) {
        e.preventDefault()
        const X = this.calculateXDown(e.clientX)
        const Y = this.calculateYDown(e.clientY)
        if (this.state.Dragging.mouseDown) {
            if (!(e.clientX < this.state.Dragging.xDown + 6 && e.clientX > this.state.Dragging.xDown - 6)) {
                var NewNodes = new Array<INodeProperty>();
                for (var i = 0; i < this.state.Nodes.length; i++) {
                    if (this.state.Nodes[i].id === this.state.Dragging.id) {
                        var updatedNode = {} as INodeProperty
                        updatedNode.id = this.state.Nodes[i].id
                        updatedNode.children = this.state.Nodes[i].children
                        updatedNode.text = this.state.Nodes[i].text
                        updatedNode.pos = Object.assign({}, this.state.Nodes[i].pos)
                        console.log(X , this.state.Dragging.yDelta, this.state.Nodes[i].pos)
                        updatedNode.pos.X = X - this.state.Dragging.xDelta
                        updatedNode.pos.Y = Y - this.state.Dragging.yDelta
                        updatedNode.style = this.state.Nodes[i].style
                        NewNodes.push(updatedNode);
                    } else {
                        NewNodes.push(this.state.Nodes[i])
                    }
                }
                this.setState({
                    Nodes: NewNodes
                })
            }
        }
    }

    onDrag(e: any) {
        //console.log("drag!", e)
    }

    onMouseUp(e: any) {
        e.preventDefault()
        if (e.clientX < this.state.Dragging.xDown + 6 && e.clientX > this.state.Dragging.xDown - 6) {
            this.onClick(e)
        } else {
            this.onDrag(e)
        }
        this.setState({
            Dragging: {
                mouseDown: false,
                xDown: 0,
                yDown: 0,
                id: "",
                xDelta: 0,
                yDelta: 0
            }
        })
    }

    render() {
        return (
            <>
                <div
                    onMouseDown={(e) => this.onMouseDown(e)}
                    onMouseUp={(e) => this.onMouseUp(e)}
                    onMouseMove={(e) => this.onMouseMove(e)}
                    style={
                        {
                            display: "grid",
                            height: this.state.Size.Y,
                            width: this.state.Size.X,
                            gridTemplateColumns: "repeat(" + Math.round(this.state.Size.X / 10) + ", 1fr)",
                            gridTemplateRows: "repeat(" + Math.round(this.state.Size.Y / 10) + ", 1fr)"
                        }
                    } >
                    {this.state.Nodes.map((val, i) => {
                        return (
                            <>
                                <UiNode key={val.id} {...val} />
                            </>
                        )
                    })}
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: "repeat(4, 1fr)",
                    backgroundColor: "red"
                }}>
                    <div style={{ gridColumnStart: "1", gridColumnEnd: "3", backgroundColor: "green" }}>Test 1</div>
                    <div style={{ backgroundColor: "green" }}>Test 2</div>
                    <div style={{ backgroundColor: "green" }}>Test 3</div>
                </div>
            </>
        )
    }
}