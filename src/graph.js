import { EuiTreeView, EuiToken, EuiIcon } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_dark.css';
import React, { useState, useEffect } from 'react';
import _ from 'lodash'
import { Modal } from './modal/modal';
import {createGraph} from './modal/graphBuild'
import ReactJson from 'searchable-react-json-view'



const Demo = (props) => {
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState({});
  useEffect(() => {
    // GET request using fetch inside useEffect React hook
    fetch('http://localhost:8000/transactionLogs/getLogsByUserName?userName=himanshu')
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log('API response:-1', data);
        let filterData = _.filter(data, node => !_.isEmpty(node['nodeId']))
        filterData = _.groupBy(filterData,'transactionId')
        console.log('API response:', filterData);
        filterData = _.map(filterData, (value, key) => {
          return createGraph(value)
        })
        console.log('API response:', filterData);
        setData(filterData);
      });

    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, []);

  const [search, setSearch] = React.useState('')
  return (
    <div>
      <EuiTreeView items={[getTopLevelView(data)]} aria-label="Sample Folder Tree" />
      <Modal data={showModal} show={!_.isEmpty(showModal)} handleClose={() => {
        setShowModal({})
      }}>
        <div style={{textAlign: 'left'}}>
          <div style={{paddingLeft: '10px', paddingTop: '10px', paddingBottom: '10px', backgroundColor: '#272822', color: "white"}}>
            Search: <input 
              value={search} 
              onChange={e => {
                setSearch(e.target.value)
              }}
              style={{
                paddingLeft: '5px', 
                paddingTop: '5px', 
                paddingBottom: '5px', 
                paddingRight: '5px', 
                width: '500px',
                backgroundColor: '#272822',
                color: "white"
              }} 
            />
          </div>
          <ReactJson 
            src={showModal} 
            theme={'monokai'} 
            collapsed={1} 
            name={false} 
            sortKeys={true}
            collapseStringsAfterLength={100}
            style={{height: '500px', textAlign: 'left', overflow: 'auto', paddingTop: '5px'}}
            highlightSearch={search.length > 3 ? search : ''}
          />
        </div>
      </Modal>
    </div>
  );
  

  function getChildData(data,label_id) {
    return _.map(data, (child,key) => {
      return getData(child,label_id+key)
    })
  }

  function getTopLevelView(data) {
    if (!data) {
      return {};
    }
    return {
      label: "api_path",
      id: "root",
      icon: <EuiIcon type="folderClosed" />,
      iconWhenExpanded: <EuiIcon type="folderOpen" />,
      children: _.map(data, (child,key) => getData(child, key))
    }
  }

  function getData(data, label_id) {
    if (!data) {
      return {};
    }
    const tempLabel = data['service_name'] + "." + data['apiName'].replaceAll('/', '.')
    return {
      label: tempLabel,
      id: tempLabel+label_id,
      icon: <EuiIcon type="folderClosed" />,
      iconWhenExpanded: <EuiIcon type="folderOpen" />,
      children: _.compact([getRequestChild(data), getResponseChild(data), getChildApis(data,label_id)])
    }
  }

  function getChildApis(data, label_id) {
    const childList = getChildData(data['childs'])
    if (_.isEmpty(childList)) {
      return null
    }
    return {
      label: "ApiCalls",
      id: data['service_name']+data['nodeId'] + data['apiName'] + "childApis"+label_id,
      icon: <EuiIcon type="folderClosed" />,
      iconWhenExpanded: <EuiIcon type="folderOpen" />,
      children: getChildData(data['childs'],label_id)
    }
  }

  function getRequestChild(data) {
    return {
      label: "Request",
      id: data['service_name'] + data['apiName'] + "request",
      icon: <EuiIcon type="tokenObject" />,
      iconWhenExpanded: <EuiIcon type="tokenObject" />,
      callback: () => {
        setShowModal(data['request'])
        console.log(data['request'])
      }
    }
  }

  function getResponseChild(data) {
    return {
      label: "Response",
      id: data['service_name'] + data['apiName'] + "response",
      icon: <EuiIcon type="tokenObject" />,
      iconWhenExpanded: <EuiIcon type="tokenObject" />,
      callback: () => {
        setShowModal(data['response'])
        console.log(data['response'])
      }
    }
  }
};
export {
  Demo
}
