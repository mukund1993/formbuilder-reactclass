import "./Select.css";
import React from 'react';

class Select extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      slectLable:'',
      selecKey: -1
    };

  }
  blurStateChange(){
    setTimeout(()=>{ this.setState({...{open: false}}) },100);
  }
  changeItem(option){
    this.setState({ ...{slectLable: option.value, open: false, selecKey: option.key}});
  }
  changeItems(option){
    let isadded = false;
    let slectLable = this.state.slectLable;
    let selecKey = this.state.selecKey;
    let index = this.state.selecKey.indexOf( option.key );

    if( index === -1){
      isadded = true;
    }
    if(isadded){
      slectLable.push( option.value );
      selecKey.push( option.key );
    }
    else{
      slectLable.splice( index,1)
      selecKey.splice( index,1)
    }
    this.setState({ ...{slectLable: slectLable, selecKey: selecKey, option:true}});
    this.props.onChange ({'target': { 'value': this.state.selecKey, lable: this.state.slectLable }}, this.props.name, this.props.defination)
  }
  componentDidMount() {
    if(this.props.type === "multiselect"){
      this.setState({ ...{slectLable: [], open: false, selecKey: []}});  
    }
  }
  render() {
    return <div className="dropdown">
    <input className="dropbtn" placeholder="Dropdown" value={this.state.slectLable} onFocus={()=> this.setState({...{open: true}})} onBlur={()=> this.blurStateChange() } onChange={e => {}}/>
    { this.state.open && this.props.type === "select" ? (<ul className="dropdown-content show">
      { this.props.options.map((option)=>
        (<li key={option.key} onMouseDown={()=>{ this.changeItem(option)} }>{option.value}</li>)
      )}
    </ul>): ''
    }
    { this.state.open && this.props.type === "multiselect" ? (<ul className="dropdown-content show">
      { this.props.options.map((option)=>
        (<li key={option.key} onMouseDown={()=>{ this.changeItems(option)} }> <input type="checkbox" onChange={e => {}} checked={ this.state.selecKey.indexOf(option.key) > -1}/> {option.value}</li>)
      )}
    </ul>): ''
    }
  </div>
  }
}

export default Select;
