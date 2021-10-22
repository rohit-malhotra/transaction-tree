import { EuiTreeView, EuiToken, EuiIcon } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_dark.css';
import React, { useState, useEffect } from 'react';
import _ from 'lodash'
import { Modal } from './modal/modal';
import {createGraph} from './modal/graphBuild'



const Demo = (props) => {
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState({});
  useEffect(() => {
    // GET request using fetch inside useEffect React hook
    fetch('http://bbf3-122-177-108-46.ngrok.io/transactionLogs/getLogsByTransactionId?transactionId=e5cc8aef1c0672f47f03edcfcf31b594')
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log('API response:-1', data);
       const Filterdata = _.filter(data, node => !_.isEmpty(node['nodeId']))
        console.log('API response:', Filterdata);
        console.log("response.json()", JSON.stringify(createGraph(Filterdata)))
        setData(createGraph(Filterdata));
      });

    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, []);
  console.log("modalData", JSON.stringify(showModal))
  return (
    <div>
      <EuiTreeView items={[getData(data)]} aria-label="Sample Folder Tree" />
      <Modal data={showModal} show={!_.isEmpty(showModal)} handleClose={() => {
        setShowModal({})
      }}>
        <p style={{ alignSelf: 'center' }}>{JSON.stringify(showModal, null, 2)}</p>
      </Modal>
    </div>
  );

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
      label: data['service_name']+"."+data['apiName'].replaceAll('/','.'),
      id: data['nodeId'] + data['method_name'],
      icon: <EuiIcon type="folderClosed" />,
      iconWhenExpanded: <EuiIcon type="folderOpen" />,
      children: _.compact([getRequestChild(data), getResponseChild(data), getChildApis(data)])
    }
  }

  function getChildApis(data) {
    const childList = getChildData(data['childs'])
    if(_.isEmpty(childList)){
      return null
    }
    return {
      label: "Apis",
      id: data['nodeId'] + data['apiName'] + "childApis",
      icon: <EuiIcon type="folderClosed" />,
      iconWhenExpanded: <EuiIcon type="folderOpen" />,
      children: getChildData(data['childs'])
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
