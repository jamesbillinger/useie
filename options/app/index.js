import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';


class Index extends Component {
  constructor() {
    super();
    this.state = {
      urls: []
    };
  }

  componentDidMount() {
    chrome.storage.sync.get('urls', (urls) => {
      this.setState({
        urls: urls || []
      });
    })
  }

  addRow() {
    const { urls } = this.state;
    this.setState({
      urls: [
        ...urls.slice(),
        ''
      ]
    });
  }

  changeURL(i, e) {
    const { urls } = this.state;
    this.setState({
      urls: [
        ...urls.slice(0, i),
        e.target.value,
        ...urls.slice(i + 1)
      ]
    })
  }

  render() {
    const { urls } = this.state;
    return (
      <div style={{display:'flex', height:'100%', width:'100%'}}>
        {urls.map((u, ui) =>
          <div key={ui} style={{display:'flex'}}>
            <div style={{flex:'0 0 auto'}}>
              <input value={u} onChange={this.changeURL.bind(this, ui)} />
            </div>
            <div>
              <button>Edit</button>
              <button>Delete</button>
            </div>
          </div>
        )}
        <div>
          <button onClick={::this.addRow}>Add Row</button>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));