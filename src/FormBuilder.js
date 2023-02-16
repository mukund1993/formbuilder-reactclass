import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Select from "./Select";

Function.prototype.pendingTimeoutCall = null;
Function.prototype.tempSymbol = 0;
Function.prototype.throtleLast = function(context, ...rest) {
  if (typeof context != "object") context = {};
  if (typeof Function.prototype.tempSymbol == "symbol") {
    context[Function.prototype.tempSymbol] = this;
    clearTimeout(Function.pendingTimeoutCall);
    Function.pendingTimeoutCall = setTimeout(() => {
      context[Function.prototype.tempSymbol](...rest);
      Function.prototype.tempSymbol = 0;
    }, 800);
    return;
  }
  Function.prototype.tempSymbol = Symbol("throt");
  context[Function.prototype.tempSymbol] = this;
  Function.pendingTimeoutCall = setTimeout(() => {
    context[Function.prototype.tempSymbol](...rest);
    Function.prototype.tempSymbol = 0;
  }, 800);
};

const throttle = (func, delay) => {
  let toThrottle = false;
  return function() {
    if (!toThrottle) {
      toThrottle = true;
      func.apply(this, arguments);
      setTimeout(() => {
        toThrottle = false;
      }, delay);
    }
  };
};

class FormBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.createState(props);
    console.log("props", props);
  }

  createState(props) {
    let data = {};
    //    let formStatus ={};
    if (props.hasOwnProperty("data")) {
      data = props.data;
    }
    this.state = { data: data, error: this.defaultErrorObject(props), formStatus: {}, isSubmitattempted: false };
  }
  changeInput = (event, name, element) => {
    let data = this.state.data;
    let error = this.state.error;
    error[name].hasVisited = true;
    data[name] = event.target.value;
    let error_ = this.errorCheck( data[name], element, name);
    error[name].valid= error_.valid;
    error[name].message= error_.msg;

    this.setState({ ...{ data: data, error: error } });
    if(element.change)
        element.change.throtleLast({},name, data[name], data)
    
        
  };
  defaultErrorObject = props => {
    let error = {};
    if (props.hasOwnProperty("data")) {
      props.elements.forEach(element => {
        let error_ = this.errorCheck(props.data[element.dataKey], element, element.dataKey);
        error[element.dataKey] = {
          hasVisited: false,
          valid: error_.valid,
          message: error_.msg
        };
      });
    }
    console.log(error);
    return error;
  };
  errorCheck = (value, rules, name) => {
    let msg = "";
    if (rules.required && !value) {
      msg = `This field is required.`;
      return {valid:false, msg:msg};
    }
    if (rules.length) {
      let [minlength, maxlength] = rules.length;
      if (minlength || maxlength) {
        if (typeof minlength === "number" && minlength > ("" + value).length) {
          // this.ERR ? this.error = this.ERR + ` field should contain minimum ${minlength} characters.` :
          msg = `This field should contain minimum ${minlength} characters.`;
        }
        if (typeof maxlength === "number" && maxlength === ("" + value).length) {
          //this.ERR ? this.error = this.ERR + ` field can contain maximum ${maxlength} characters.` :
          msg = `This field can contain maximum ${maxlength} characters.`;
        }
      }
    }
    if(rules.pattern && !value.match( rules.pattern) ){
      msg = rules.pattern_error;
    }

    if (msg) {
      return {valid:false, msg:msg};
    } else {
      return {valid:true, msg:msg};
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({...{isSubmitattempted:true}});
    this.props.submit(this.state.data, this.state.error);
  };
  clearAll = () => {
    let data = {};
    let error = {};
    if (this.props.hasOwnProperty("data")) {
      this.props.elements.forEach(element => {
        data[element.dataKey] = "";
        let error_ = this.errorCheck(this.props.data[element.dataKey], element, element.dataKey);
        error[element.dataKey] = { hasVisited: false,
            valid: error_.valid,
            message: error_.msg };
      });
    }
    this.setState({ data: data, error: error, isSubmitattempted:false }, () => {
      console.log(this.state);
      // this.forceUpdate()
    });
  };
  
  render() {
   console.log("===", this.props)
    return (
      <form onSubmit={ev => this.handleSubmit(ev)} noValidate>
        {this.props.elements?.map(element => (
          <div key={element.dataKey}>
            <label className="block">{element.label}</label>
            {element.type === "input" ? (
              <input
                type="text"
                className="form-control text-wrap"
                value={this.state.data[element.dataKey]}
                onChange={ev => this.changeInput(ev, element.dataKey, element)}
                required={element.required ? true : false}
                name={element.dataKey}
                {...(element.pattern ?{pattern : element.pattern} : {})}
                {...(element.length && element.length[0] && typeof element.length[0] == "number" ?{minLength : element.length[0]} : {})}
                {...(element.length && element.length[1] && typeof element.length[1] == "number" ?{maxLength : element.length[1]} : {})}
              />
            ) : (
              ""
            )}

            {element.type === "textarea" ? (
              <textarea
                type="text"
                className="form-control text-wrap"
                value={this.state.data[element.dataKey]}
                onChange={ev => this.changeInput(ev, element.dataKey, element)}
                required={element.required ? true : false}
                name={element.dataKey}
                {...(element.pattern ?{pattern : element.pattern} : {})}
                {...(element.length && element.length[0] && typeof element.length[0] == "number" ?{minLength : element.length[0]} : {})}
                {...(element.length && element.length[1] && typeof element.length[1] == "number" ?{maxLength : element.length[1]} : {})}
              />
            ) : (
              ""
            )}

{element.type === "select" || element.type === "multiselect" ? (
              <Select
                type={element.type}
                className="form-control text-wrap"
                options={element.options}
                // value={this.state.data[element.dataKey]}
                onChange={ this.changeInput.bind(this)}
                // required={element.required ? true : false}
                defination={element}
                name={element.dataKey}
              />
              
            ) : (
              ""
            )}

            { this.state.isSubmitattempted && this.state.error && this.state.error[element.dataKey] && !this.state.error[element.dataKey].valid ? (<span className="ERR2 text-danger">{this.state.error[element.dataKey].message}</span>) : ''}
          </div>
        ))}
        <div className="row">
          <div className="float-right">
            {this.props.reset ? (
              <button className="btn btn-primary right-menu-btn" type="button" onClick={ev => this.clearAll()}>
                Clear
              </button> ) : ("")
            }
            <button className="btn btn-primary right-menu-btn" type="submit">
              Add
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default FormBuilder;
