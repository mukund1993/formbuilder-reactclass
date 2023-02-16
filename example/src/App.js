import React from 'react'
import 'formbuilder-react/dist/index.css'
import FormBuilder from 'formbuilder-react'

class App extends React.Component {
    constructor() {
        super();
        this.state = {
          "someKey": {
            "elements": 
            [
            {
                "label": "Title email",
                "type": "input",
                "required": true,
                "length": [1, 30],
                "pattern": `[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-zA-Z]{2,4}`,
                "pattern_error": `It should be like: mmmm@mmm.mmm`,
                "dataKey": "title",
                "mask": "",
                "change": this.onTitleChange.bind(this)
            },
            {
                "label": "Reference for procedure",
                "type": "textarea",
                "required": true,
                "length": [1, 2000],
                "pattern": "",
                "dataKey": "procedureReference",
                "mask": ""
            },
            {
                "label": "Diagram reference (where applicable)",
                "type": "input",
                "dataKey": "diagram",
                mask: "",
                "change": (value) => { }
            },
            {
                "label": "Brief description of procedure",
                "type": "select",
                "options": [{key:1, value: 'Cold'},{key:2, value: 'Hot'},{key:3, value: 'Chemical'},{key:4, value: 'Physical'}],
                "required": true,
                "dataKey": "description"
            },
            {
              "label": "Brief description of procedure 2",
              "type": "multiselect",
              "options": [{key:1, value: 'Cold'},{key:2, value: 'Hot'},{key:3, value: 'Chemical'},{key:4, value: 'Physical'}],
              "required": true,
              "dataKey": "multidescription",
              "change": this.onTitleChange.bind(this)
            },
            {
                "label": "Post or department responsible for the procedure and for any data generated",
                "type": "textarea",
                "required": true,
                "length": [1, 100],
                "pattern": "",
                "dataKey": "responsibleParty",
                "mask": "",
                "change": (value) => { }
            },
            {
                "label": "Location where records are kept",
                "type": "textarea",
                "required": true,
                "length": [1, 2000],
                "pattern": "",
                "dataKey": "recordsLocation",
                "mask": "",
                "change": (value) => { }
            },
            {
                "label": "Name of IT system used (where applicable).",
                "type": "input",
                "length": [1, 100],
                "pattern": "",
                "dataKey": "itSystemname",
                "mask": "",
                "change": (value) => { }
            },
            {
                "label": "List of EN or other standards applied (where relevant)",
                "type": "input",
                "length": [1, 100],
                "pattern": "",
                "dataKey": "standardApplied",
                "mask": "",
                "change": (value) => { }
            }  ],
        data: {  
        "title": "test@mmm.com",  
        "procedureReference": "",  
        "diagram": "",  
        "description": "",  
        "responsibleParty": "",  
        "recordsLocation": "",  
        "itSystemname": "",  
        "standardApplied": ""
        },
        reset: true,
        edit: (changedkey) => {      
        },
        submit: this.onsubmit.bind(this)
        }
        };
    
        this.myRef = React.createRef();
      }
    
      onsubmit(data, status){
        console.log(this,data, status);
      }
      onTitleChange(name,value,data){
        console.log(this,name,value,data);
      }

  render() {
    return <FormBuilder ref={this.myRef} {...this.state.someKey}></FormBuilder>;
  }
}

export default App;
