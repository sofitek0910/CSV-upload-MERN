import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import CSVReader from 'react-csv-reader';
import axios from 'axios';

class MainSection extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      apiResponse: '',
      file: null,
      products: []
    };
    this.handleImport = this.handleImport.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  callAPI() {
      fetch("http://localhost:5000/testAPI")
          .then(res => res.text())
          .then(res => this.setState({ apiResponse: res }));
          console.log(this.state.apiResponse)
  }

  componentDidMount() {
      // this.callAPI();
  }

  handleImport(data){
    console.log('data.target.files[0]: ', data.target.files[0]);
    this.setState({file:data.target.files[0]});
  }

  //I'm not using handlesubmit here as it involves a button press 
  handleSubmit(e){
    e.preventDefault();
    const data = new FormData();
    data.append('file', this.state.file);

    console.log(data);

    axios.post("http://localhost:5000/upload", data, { // receive two parameter endpoint url ,form data 
    }).then(res => { // then print response status
        var products = res.data.map(o => {
          return {
            id: o[Object.keys(o)[0]].split(';')[0].split('\"')[0],
            name: o[Object.keys(o)[0]].split(';')[1].split('\"')[1],
            url: o[Object.keys(o)[0]].split(';')[2].split('\"')[1]
          }
        });
        console.log('products: ', products);
        this.setState({products});
    })
  } 


  render() {
    return (
      <div className="main-section">
        {
          this.state.products.length === 0
          ? <form id="csvForm" action='' onSubmit={this.handleSubmit} method='post' encType="multipart/form-data">
            <p>upload your part number list (.xls or .csv)</p>
            <input id="uploadCSV" type="file" name="csv_form" onChange={this.handleImport} />
            <input type="submit" className="submitButton" />
          </form>
          : <div className="products">
            {
              this.state.products.map((o, idx) => {
                return (<div className="item" key={idx}>
                  {o.id} - {o.name}
                  <img src={o.url} width={150} height={150}/>
                </div>);
              })
            }
          </div>
        }
        
      </div>
    );
  }
}

export default MainSection;