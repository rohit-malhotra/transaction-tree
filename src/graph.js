import { EuiTreeView, EuiToken, EuiIcon } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_dark.css';
import React, { useState, useEffect } from 'react';
import _ from 'lodash'

function getChildData(data) {
  return _.map(data, child => {
    return getData(child)
  })
}

function getData(data) {
  if (!data) {
    return {};
  }

  return {
    label: data['service_name'],
    id: data['service_name'] + data['method_name'],
    icon: <EuiIcon type="folderClosed" />,
    iconWhenExpanded: <EuiIcon type="folderOpen" />,
    children: [getRequestChild(data), getResponseChild(data), getChildApis(data)]
  }
}

function getChildApis(data) {
  return {
    label: "Apis",
    id: data['service_name'] + data['method_name'] + "childApis",
    icon: <EuiIcon type="folderClosed" />,
    iconWhenExpanded: <EuiIcon type="folderOpen" />,
    children: getChildData(data['childs'])
  }
}

function getRequestChild(data) {
  return {
    label: "Request",
    id: data['service_name'] + data['method_name'] + "request",
    icon: <EuiIcon type="folderClosed" />,
    iconWhenExpanded: <EuiIcon type="folderOpen" />,
  }
}

function getResponseChild(data) {
  return {
    label: "Response",
    id: data['service_name'] + data['method_name'] + "response",
    icon: <EuiIcon type="folderClosed" />,
    iconWhenExpanded: <EuiIcon type="folderOpen" />,
  }
}

const Demo = (props) => {
  // const data = props.data

  const [data, setData] = useState(null);

  useEffect(() => {
    // GET request using fetch inside useEffect React hook
    fetch('http://localhost:8000/transactionLogs/getLogsByUserName?userName=rohit')
      .then(response => response.json())
      .then(data => {
        console.log('API response:', data);
        setData(data);
      });

    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, []);
  
  return (
    <div style={{ width: '20rem' }}>
      <EuiTreeView items={[getData(data)]} aria-label="Sample Folder Tree" />
    </div>
  );
};
export {
  Demo
}
