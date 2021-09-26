import React from 'react';
import {ActivityBuilder, Assign, InvokeWorkflowFile, If, Sequence } from './components/ui'
import {UiNode, Designer} from './components/designer'



const test = new Sequence()
test.AddActivity(new InvokeWorkflowFile())
test.AddActivity(new Assign())
var i = new If()
i.Arguments[3].Value.AddActivity(new InvokeWorkflowFile())
console.log(i)
test.AddActivity(i)

//console.log(test)
function App() {
  return (
    <>
    <Designer />
          </>
  );
}

export default App;
