import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import isEqual from 'lodash/isEqual';

class Index extends Component {
  constructor() {
    super();
    this.state = {
      urls: [
        ''
      ],
      savedURLs: [
        ''
      ]
    };
  }

  componentDidMount() {
    chrome.storage && chrome.storage.sync.get('urls', (ret) => {
      if (ret.urls && Array.isArray(ret.urls)) {
        this.setState({
          urls: ret.urls,
          savedURLs: ret.urls
        });
      }
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

  deleteRow(i) {
    const { urls } = this.state;
    this.setState({
      urls: [
        ...urls.slice(0, i),
        ...urls.slice(i + 1)
      ]
    })
  }

  save() {
    const { urls } = this.state;
    chrome.storage && chrome.storage.sync.set({urls}, () => {
      this.setState({
        savedURLs: urls
      })
    });
  }

  cancel() {
    const { savedURLs } = this.state;
    this.setState({
      urls: savedURLs
    });
  }

  render() {
    const { urls, savedURLs } = this.state;
    let isDefault = isEqual(urls, savedURLs);
    return (
      <div style={{display:'flex'}}>
        <div style={{margin:'15px 25px'}}>
          <div style={{padding:'5px 0', color:'#999'}}>Example: ://ie.example.com/</div>
          {urls.map((u, ui) =>
            <div key={ui} style={{display:'flex', padding:'2px 0'}}>
              <div style={{flex:'0 0 auto', marginRight:'10px'}}>
                <input value={u} onChange={this.changeURL.bind(this, ui)} style={{width:'300px'}}/>
              </div>
              <div style={{cursor:'pointer', color:'#d01947', textDecoration:'underline'}} onClick={this.deleteRow.bind(this, ui)}>Delete</div>
            </div>
          )}
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <div onClick={::this.addRow} style={{cursor:'pointer', color:'#00b5ef', textDecoration:'underline', padding:'5px 0'}}>Add Row</div>
            <div style={{display:'flex'}}>
              <div onClick={isDefault ? null : ::this.save}
                   style={{cursor:isDefault ? 'default' : 'pointer', color:isDefault ? '#bbb' : '#00b381', textDecoration:'underline', padding:'5px 0', marginRight:'10px'}}>
                Save
              </div>
              <div onClick={isDefault ? null : ::this.cancel}
                   style={{cursor:isDefault ? 'default' : 'pointer', color:isDefault ? '#bbb' : '#d01947', textDecoration:'underline', padding:'5px 0'}}>
                Cancel
              </div>
            </div>
          </div>
          {!isDefault && <div style={{color:'#f68d38', padding:'2px 0', textAlign:'right', fontSize:'11px'}}>You have unsaved changed *</div>}
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));