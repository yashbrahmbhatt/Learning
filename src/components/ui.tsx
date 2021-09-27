import React from 'react';
import { Container, Col, Card, Form, Row } from 'react-bootstrap'
import { Tree } from '@blueprintjs/core'
import { UiNode, Designer } from './designer';



export enum ArgumentDirectionTypes {
    "In" = "In",
    "InOut" = "InOut",
    "Out" = "Out"
}

export enum LogEntryTypes {
    "No" = "No",
    "OnlyInvocation" = "OnlyInvocation",
    "WithArguments" = "WithArguments"
}

export enum LogExitTypes {
    "No" = "No",
    "OnlySuccessfulReturn" = "OnlySuccessfulReturn",
    "WithArguments" = "WithArguments"
}

export enum LogLevelTypes {
    "Trace" = "Trace",
    "Info" = "Info",
    "Warn" = "Warn",
    "Error" = "Error",
    "Fatal" = "Fatal"
}

export enum TargetSessionTypes {
    "Current" = "Current",
    "Main" = "Main",
    "Picture in Picture" = "Picture in Picture"
}

export class Argument {
    Name: String;
    Direction: ArgumentDirectionTypes;
    Type: String;
    Value: any

    constructor(name?: string, direction?: ArgumentDirectionTypes, type?: string, value?: any) {
        this.Name = name ? name : "Argument";
        this.Direction = direction ? direction : ArgumentDirectionTypes.In;
        this.Type = type ? type : "System.String";
        this.Value = value;
    }
}

/*
/////////////////////////////////
/////////////////////////////////
/////////////////////////////////
/////////////////////////////////
/////////////////////////////////
*/

export interface Workflow {
    Name: string
    Arguments: Argument[]
    Namespaces: String[]
    References: String[]
    Children: Activity[]
}









export class Activity {
    Name: string = "String"
    Namespace: string = "System"
    DisplayName: string = "Activity"
    Arguments: Argument[] = []
}

export class Sequence extends Activity {
    Body: Activity[] = new Array<Activity>()

    AddActivity(a: Activity) {
        this.Body.push(a)
    }
}

export interface ActivityBuilderState {
    Root: Sequence
    Selected: Activity
}

export interface ActivityBuilderProperties {
    Name: String,
    Root?: Sequence
}

export class InvokeWorkflowFile extends Activity {
    Name: string = "InvokeWorkflowFile"
    Namespace: string = "UiPath.Core.Activities"
    DisplayName: string = "Invoke Workflow File"
    Arguments: Argument[] = [
        new Argument("ContinueOnError", ArgumentDirectionTypes.In, "System.Boolean", false),
        new Argument("Timeout", ArgumentDirectionTypes.In, "System.Int32", 30000),
        new Argument("Arguments", ArgumentDirectionTypes.In, "ui.Argument[]", new Array<Argument>()),
        new Argument("Arugments Variable", ArgumentDirectionTypes.In, "System.String", ""),
        new Argument("Isolated", ArgumentDirectionTypes.In, "System.Boolean", false),
        new Argument("WorkflowFileName", ArgumentDirectionTypes.In, "System.String", ""),
        new Argument("Log Entry", ArgumentDirectionTypes.In, "ui.LogEntryTypes", LogEntryTypes.No),
        new Argument("Log Exit", ArgumentDirectionTypes.In, "ui.LogExitTypes", LogExitTypes.No),
        new Argument("Log Level", ArgumentDirectionTypes.In, "ui.LogLevelTypes", LogLevelTypes.Info),
        new Argument("Private", ArgumentDirectionTypes.In, "System.Boolean", false),
        new Argument("Target Session", ArgumentDirectionTypes.In, "ui.TargetSessionTypes", TargetSessionTypes.Current)
    ]

}

export class Assign extends Activity {
    Name: string = "Assign"
    Namespace: string = "UiPath.Activities.Statements"
    DisplayName: string = "Assign"
    Arguments: Argument[] = [
        new Argument("ContinueOnError", ArgumentDirectionTypes.In, "System.Boolean", false),
        new Argument("To", ArgumentDirectionTypes.In, "System.String", ""),
        new Argument("From", ArgumentDirectionTypes.In, "System.String", "")

    ]
}

export class If extends Activity {
    Name: string = "If"
    Namespace: string = "UiPath.Activities.Statements"
    DisplayName: string = "If"
    Arguments: Argument[] = [
        new Argument("ContinueOnError", ArgumentDirectionTypes.In, "System.Boolean", false),
        new Argument("Condition", ArgumentDirectionTypes.In, "System.String", ""),
        new Argument("Private", ArgumentDirectionTypes.In, "System.Boolean", false),
        new Argument("If.True", ArgumentDirectionTypes.In, "ui.IfTrue", new Sequence()),
        new Argument("If.False", ArgumentDirectionTypes.In, "ui.IfFalse", new Sequence())
    ]
}


export class ActivityBuilder extends React.Component<ActivityBuilderProperties, ActivityBuilderState> {

    constructor(props: ActivityBuilderProperties) {
        super(props)
        this.state = {
            Root: this.props.Root ? this.props.Root : new Sequence(),
            Selected: this.props.Root ? this.props.Root : new Sequence()
        }
    }

    componentDidMount() {
        this.setState({
            Selected: this.state.Root.Body[0]
        })
        //console.log(this.state)
    }

    OnInputChange(e: React.FormEvent<HTMLElement>) {

        // Get Keys and Clone state + arguments so that we can update it without knowing the actual structure
        var keys = Object.keys(this.state.Selected.Arguments);
        const newArguments = [...this.state.Selected.Arguments] as any
        const newState = Object.assign({}, this.state)
        const event = e as any

        // Update the Input
        keys.forEach((val, i) => {
            if (newArguments[i].Name === event.target.id) {
                newArguments[i].Value = event.target.value;
            }
        })

        newState.Selected.Arguments = newArguments

        // Set new state
        this.setState(newState)

    }

    OnButtonChange(e: React.FormEvent<HTMLElement>) {
    }

    OnSelectChange(e: React.FormEvent<HTMLElement>) {

        // Get Keys and Clone state + arguments so that we can update it without knowing the actual structure
        var keys = Object.keys(this.state.Selected.Arguments);
        const newArguments = [...this.state.Selected.Arguments]
        const newState = Object.assign({}, this.state)
        const event = e as any

        // Update the Input
        keys.forEach((val, i) => {
            if (newArguments[i].Name === event.target.id) {
                newArguments[i].Value = event.target.value;
            }
        })

        newState.Selected.Arguments = newArguments

        // Set new state
        this.setState(newState)

    }

    OnCheckboxChange(e: React.FormEvent<HTMLElement>) {

        // Get Keys and Clone state + arguments so that we can update it without knowing the actual structure
        var keys = Object.keys(this.state.Selected.Arguments);
        const newArguments = [...this.state.Selected.Arguments]
        const newState = Object.assign({}, this.state)
        const event = e as any
        // Update the Input
        keys.forEach((val, i) => {
            if (newArguments[i].Name === event.target.id) {
                newArguments[i].Value = !newArguments[i].Value;
            }
        })

        newState.Selected.Arguments = newArguments

        // Set new state
        this.setState(newState)
    }

    generateEnumSelects(enums: any) {
        return (Object.keys(enums).map((v) => {
            return (
                <>
                    <option value={v}>{v}</option>
                </>
            )
        }))
    }

    componentDidUpdate() {
        //console.log(this.state)
    }

    renderPropertiesBody(activity: Activity) {
        if (activity && activity.Arguments) {
            var ret = new Array<JSX.Element>();
            Object.keys(activity.Arguments).forEach((val, i) => {
                if (activity.Arguments.length > 0) {
                    const selected = activity.Arguments as any
                    var name = selected[i].Name;
                    var type = selected[i].Type;
                    var value = selected[i].Value;
                    switch (type) {
                        case 'ui.IfTrue':
                            ret.push(
                                <>
                                    <Form.Group as={Row} className='mb-3'>
                                        <Form.Label>{name}</Form.Label>
                                        <Col sm='9'>
                                            {this.renderBody(value)}
                                        </Col>
                                    </Form.Group>
                                </>
                            )
                            break;
                        case "ui.IfFalse":
                            ret.push(
                                <>
                                    <td></td>
                                </>
                            )
                            break;
                        case 'System.String':
                            ret.push(
                                <>
                                    <Form.Group as={Row} className='mb-3'>
                                        <Form.Label column sm='3' >{name}</Form.Label>
                                        <Col sm='9'>
                                            <Form.Control id={name} onChange={(e) => this.OnInputChange(e)} value={value} />
                                        </Col>
                                    </Form.Group>
                                </>
                            )
                            break;
                        case 'System.Int32':
                            ret.push(
                                <>
                                    <Form.Group as={Row} className='mb-3'>
                                        <Form.Label column sm='3' >{name}</Form.Label>
                                        <Col sm='9'>
                                            <Form.Control id={name} onChange={(e) => this.OnInputChange(e)} value={value} />
                                        </Col>
                                    </Form.Group>
                                </>
                            )
                            break;
                        case 'System.Boolean':
                            ret.push(
                                <>
                                    <Form.Group as={Row} className='mb-3'>
                                        <Form.Label column sm='3' >{name}</Form.Label>
                                        <Col sm='1'>
                                            <Form.Check type="checkbox" id={name} onChange={(e) => this.OnCheckboxChange(e)} checked={value} />
                                        </Col>
                                    </Form.Group>
                                </>
                            )
                            break;
                        case 'ui.LogEntryTypes':
                            var enumTypes = new Array<string>()
                            var types = Object.values(LogEntryTypes).forEach((val) => {
                                enumTypes.push(val)
                            })
                            ret.push(
                                <>
                                    <Form.Group as={Row} className='mb-3'>
                                        <Form.Label column sm='3' >{name}</Form.Label>
                                        <Col sm='9'>
                                            <Form.Select onChange={(e) => this.OnSelectChange(e)} id={name} value={value}>
                                                {enumTypes.map((val, i) => {
                                                    return (
                                                        <option>
                                                            {val}
                                                        </option>
                                                    )
                                                })}
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>
                                </>
                            )
                            break;
                        case 'ui.LogExitTypes':
                            var enumTypes = new Array<string>()
                            var types = Object.values(LogExitTypes).forEach((val) => {
                                enumTypes.push(val)
                            })
                            ret.push(
                                <>
                                    <Form.Group as={Row} className='mb-3'>
                                        <Form.Label column sm='3' >{name}</Form.Label>
                                        <Col sm='9'>
                                            <Form.Select onChange={(e) => this.OnSelectChange(e)} id={name} value={value}>
                                                {enumTypes.map((val, i) => {
                                                    return (
                                                        <option>
                                                            {val}
                                                        </option>
                                                    )
                                                })}
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>
                                </>
                            )
                            break;
                        case 'ui.LogLevelTypes':
                            var enumTypes = new Array<string>()
                            var types = Object.values(LogLevelTypes).forEach((val) => {
                                enumTypes.push(val)
                            })
                            ret.push(
                                <>
                                    <Form.Group as={Row} className='mb-3'>
                                        <Form.Label column sm='3' >{name}</Form.Label>
                                        <Col sm='9'>
                                            <Form.Select onChange={(e) => this.OnSelectChange(e)} id={name} value={value}>
                                                {enumTypes.map((val, i) => {
                                                    return (
                                                        <option>
                                                            {val}
                                                        </option>
                                                    )
                                                })}
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>
                                </>
                            )
                            break;
                        case 'ui.TargetSessionTypes':
                            var enumTypes = new Array<string>()
                            var types = Object.values(TargetSessionTypes).forEach((val) => {
                                enumTypes.push(val)
                            })
                            ret.push(
                                <>
                                    <Form.Group as={Row} className='mb-3'>
                                        <Form.Label column sm='3' >{name}</Form.Label>
                                        <Col sm='9'>
                                            <Form.Select onChange={(e) => this.OnSelectChange(e)} id={name} value={value}>
                                                {enumTypes.map((val, i) => {
                                                    return (
                                                        <option>
                                                            {val}
                                                        </option>
                                                    )
                                                })}
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>
                                </>
                            )
                            break;
                        case 'ui.Argument[]':
                            ret.push(
                                <>
                                    <Form.Group as={Row} className='mb-3'>
                                        <Form.Label column sm='3'>{name}</Form.Label>
                                        <Col sm='9'>
                                            <Form.Control id={name} type='button' onClick={(e) => this.OnButtonChange(e)} value="Edit" />
                                            {//<Button id={name} label="Edit Arguments" onClick={(e) => this.OnButtonChange(e)} />
                                            }
                                        </Col>
                                    </Form.Group>
                                </>
                            )
                            break;
                        default:
                            ret.push(
                                <>
                                    <Form.Group as={Row} className='mb-3'>
                                        <Form.Label column sm='3'>{name}</Form.Label>
                                    </Form.Group>
                                </>
                            )
                            break;
                    }
                } else {
                    return <></>
                }

            })
            return ret
        } else {
            return <></>
        }


    }

    renderBody(a: Sequence) {
        console.log(a)
        if (a.Body) {
            const body = a.Body.map((val, i) => {
                // console.log(val)
                return (
                    <>
                        <Card id={i.toString()} onClick={(e: React.MouseEvent<HTMLInputElement>) => this.onSelectedChange(e)}>{val.DisplayName}</Card>
                    </>
                )
            })
            return body
        } else {
            return null
        }


    }

    onSelectedChange(e: React.MouseEvent<HTMLInputElement>) {
        const target = e.target as any
        this.setState({
            Selected: this.state.Root.Body[target.id]
        })
    }

    render() {
        return (
            <>
                <Designer></Designer>
                <Container fluid>
                    <Row>
                        <Col md='9'>
                            {this.renderBody(this.state.Root)}
                        </Col>
                        <Col md='3'>
                            <Container>
                                <Form>
                                    {this.renderPropertiesBody(this.state.Selected)}
                                </Form>

                            </Container>
                        </Col>
                    </Row>

                </Container>

            </>
        )
    }
}

/*
export interface PropertyTableProperties {
    Properties: any,
    TableElement: JSX.Element,
    OnPropertyChange(PropertyState: any): void,
    Schema: Argument[]
}

export class PropertyTable extends React.Component<PropertyTableProperties, PropertyTableProperties> {
    constructor(props: PropertyTableProperties) {
        super(props);
        const z = Object.keys(this.props.Properties[0]).map((val, i, arr) => {
            return new Argument(val, ArgumentDirectionTypes.In, "System.String", "")
        })
        this.state = {
            Properties: this.props.Properties,
            TableElement: this.props.TableElement,
            OnPropertyChange: props.OnPropertyChange,
            Schema: z
        }
    }

    /*    onChange(e: React.ChangeEvent<HTMLInputElement>){
            var keys = Object.keys(this.state.Properties);
            keys.forEach((val, i, arr) => {
                if(val === e.target.id) {
                    const newProperties = Object.assign({}, this.state.Properties)
                    newProperties[val] = e.target.value
                    this.setState({
                        Properties: newProperties
                    })
                }
            })
        }


    onExpressionChange(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) {
        var keys = Object.keys(this.state.Properties);
        keys.forEach((val, i, arr) => {

            if (val === e.target.id) {
                const newProperties = Object.assign({}, this.state.Properties)
                if(e.target.type === "checkbox"){
                    newProperties[val].Value = !newProperties[val].Value
                } else {
                    newProperties[val].Value = e.target.value
                }

                this.state.OnPropertyChange(newProperties);
                this.setState({ Properties: newProperties })
            }
        })
    }

    onDictionaryEditor(e: React.MouseEvent<HTMLInputElement>){
        console.log(e.target)
    }

    generateEnumSelects(enums: any) {
        return (Object.keys(enums).map((v) => {
            return (
                <>
                    <option value={v}>{v}</option>
                </>
            )
        }))
    }

    generateTable() {
        var keys = Object.keys(this.state.Properties);
        var vals = Object.values(this.state.Properties) as any;
        const properties = keys.map((val, i, arr) => {
            var type = vals[i].Type;
            var value = vals[i].Value;
            switch (type) {
                case 'System.String':
                    return (
                        <tr>
                            <td>{val}</td>
                            <td>
                                <input type='text' id={val} onChange={(e) => this.onExpressionChange(e)} value={value as string} ></input>
                            </td>
                        </tr>
                    )
                case 'System.Int32':
                    return (
                        <tr>
                            <td>{val}</td>
                            <td>
                                <input type='text' id={val} onChange={(e) => this.onExpressionChange(e)} value={value as string}></input>
                            </td>
                        </tr>
                    )
                case 'System.Boolean':
                    return (
                        <tr>
                            <td>{val}</td>
                            <td>
                                <input type='checkbox' id={val} onChange={(e) => this.onExpressionChange(e)} value={value as string}></input>
                            </td>
                        </tr>
                    )
                case 'ui.LogEntryTypes':
                    return (
                        <tr>
                            <td>{val}</td>
                            <td>
                                <select id={val} onChange={(e) => this.onExpressionChange(e)}>
                                    {this.generateEnumSelects(LogEntryTypes)}
                                </select>
                            </td>
                        </tr>
                    )
                case 'ui.LogExitTypes':
                    return(
                        <tr>
                            <td>{val}</td>
                            <td>
                                <select id={val} onChange={(e) => this.onExpressionChange(e)}>
                                    {this.generateEnumSelects(LogExitTypes)}
                                </select>
                            </td>
                        </tr>
                    )
                case 'ui.LogLevelTypes':
                    return(
                        <tr>
                            <td>{val}</td>
                            <td>
                                <select id={val} onChange={(e) => this.onExpressionChange(e)}>
                                    {this.generateEnumSelects(LogLevelTypes)}
                                </select>
                            </td>
                        </tr>
                    )
                case 'ui.TargetSessionTypes':
                    return(
                        <tr>
                            <td>{val}</td>
                            <td>
                                <select id={val} onChange={(e) => this.onExpressionChange(e)}>
                                    {this.generateEnumSelects(TargetSessionTypes)}
                                </select>
                            </td>
                        </tr>
                    )
                case 'ui.Arguments':
                    return (
                        <tr>
                            <td>{val}</td>
                            <td>
                                <input type="button" value="Edit Arguments" onClick={(e) => {this.onDictionaryEditor(e)}} />
                            </td>
                        </tr>
                    )
                default:
                    console.log(type)
                    return (
                        <tr>
                            <td>{val}</td>
                            <td></td>
                        </tr>
                    )
            }
        })
        return (properties)
    }

    componentDidUpdate() {
    }


    render() {
        return (
            <>
                <table>
                    <tbody>
                        {this.generateTable()}
                    </tbody>
                </table>
                <TableDesigner schema={this.state.Schema} values={this.state.Properties.Argument.Value}/>
            </>
        )
    }
}


export class InvokeWorkflowFileProperties {

    // Common
    ContinueOnError: Argument = new Argument("ContinueOnError", ArgumentDirectionTypes.In, "System.Boolean", false);
    DisplayName: Argument = new Argument("DisplayName", ArgumentDirectionTypes.In, "System.String", "Invoke Workflow File");
    Timeout: Argument = new Argument("Timeout", ArgumentDirectionTypes.In, "System.Int32", 30000);;

    // Input
    Arguments: Argument = new Argument("Arguments", ArgumentDirectionTypes.In, "ui.Arguments", new Array<Argument>(9).fill(new Argument("Test", ArgumentDirectionTypes.In, "Test", "")) as Argument[]);;
    Isolated: Argument = new Argument("Isolated", ArgumentDirectionTypes.In, "System.Boolean", false);;
    WorkflowFileName: Argument = new Argument("WorkflowFileName", ArgumentDirectionTypes.In, "System.String", "");;

    // Log
    LogEntry: Argument = new Argument("LogEntry", ArgumentDirectionTypes.In, "ui.LogEntryTypes", LogEntryTypes.No);;
    LogExit: Argument = new Argument("LogExit", ArgumentDirectionTypes.In, "ui.LogExitTypes", LogExitTypes.No);;
    LogLevel: Argument = new Argument("LogLevel", ArgumentDirectionTypes.In, "ui.LogLevelTypes", LogLevelTypes.Info);;

    // Misc
    Private: Argument = new Argument("Private", ArgumentDirectionTypes.In, "System.Boolean", false);;
    TargetSession: Argument = new Argument("TargetSession", ArgumentDirectionTypes.In, "ui.TargetSessionTypes", TargetSessionTypes.Current);;

}

export interface DesignerState {
    Arguments: Argument[]
    Values: Argument[]
}

export class DesignerUI extends React.Component<InvokeWorkflowFileProperties, DesignerState>{

    constructor(props: InvokeWorkflowFileProperties){
        super(props);
        const y = new InvokeWorkflowFileProperties()
        const x = Object.keys(this.props).map((val, i, arr) => {
            const z = y as any
            console.log()
            return new Argument(z[val].Name, z[val].Direction, z[val].Type, z[val].Value)
        })
        const z = Object.keys(x[0]).map((val, i, arr) => {
            return new Argument(val, ArgumentDirectionTypes.In, "System.String", "")
        })
        console.log(z)
        this.state = {
            Arguments: z,
            Values: x
        }
    }

    PropertyTableOnChange(PropertyState: any) {
        this.setState(PropertyState)
    }

    componentDidUpdate() {
    }



    render() {
        return (
            <>
                <PropertyTable OnPropertyChange={(PropertyState: any) => this.PropertyTableOnChange(PropertyState)} Properties={this.props} TableElement={<></>} />
                <TableDesigner schema={this.state.Arguments} values={this.state.Values}></TableDesigner>
            </>
        )
    }
}

export interface TableDesignerProperties {
    schema: Argument[],
    values: any
}

export class TableDesigner extends React.Component<TableDesignerProperties>{

    constructor(props: TableDesignerProperties){
        super(props)
    }
    renderHeaders(){
        const headers = Object.keys(this.props.schema).map((val, i, arr) => {
            const schema = this.props.schema as any
            return (
                <>
                <th>{schema[val].Name}</th>
                </>
            )
        })
        return headers
    }

    renderBody(){
        console.log(this.props);
        const body = Object.keys(this.props.values).map((val, i, arr) => {
            const values = this.props.values as any
            console.log(values[val])
            return(
                <>
                    <tr>
                        <td>{values[val].Name}</td>
                        <td>{values[val].Direction}</td>
                        <td>{values[val].Type}</td>
                        <td>{typeof(values[val].Value) === 'object' ? "true" : values[val].Value}</td>
                    </tr>
                </>
            )
        })
        console.log(body)
        return <tbody>
            {body}
        </tbody>
    }

    render(){
        return(
            <>
            <table>
                {this.renderHeaders()}
                {this.renderBody()}
            </table>
            </>
        )
    }
}

*/