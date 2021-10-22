'use strict'
const _ = require('lodash');

const dummyobject1 = {
    serviceId: 'growth-service',
    apiName: 'aa',
    parentId: null,
    nodeId: '8769679',
    requestObject: { customerRequestId: '14124' },
    responseObject: { data: 'response data ' },
}
const dummyobject2 = {
    serviceId: 'catalog-service',
    apiName: 'ba',
    parentId: '8769679',
    nodeId: '123445',
    requestObject: { customerRequestId: '14124' },
    responseObject: { data: 'response data ' },
}
const dummyobject3 = {
    serviceId: 'catalog-service',
    apiName: 'bb',
    parentId: '8769679',
    nodeId: '54321',
    requestObject: { customerRequestId: '14124' },
    responseObject: { data: 'response data ' },
}

const dummyobject4 = {
    serviceId: 'slot-service',
    apiName: 'ca',
    parentId: '123445',
    nodeId: '87998',
    requestObject: { customerRequestId: '14124' },
    responseObject: { data: 'response data ' },
}

const dummyobject5 = {
    serviceId: 'mm-hysterisis-service',
    apiName: 'da',
    parentId: '54321',
    nodeId: '88887',
    requestObject: { customerRequestId: '14124' },
    responseObject: { data: 'response data ' },
}

const dummyarray = [dummyobject1, dummyobject2, dummyobject3, dummyobject4, dummyobject5]

// const Node = class {
//     constructor(serviceId, apiName, requestObject, responseObject) {
//         this.serviceId = serviceId,
//             this.apiName = apiName,
//             this.requestObject = requestObject,
//             this.responseObject = responseObject,
//             this.childs = []
//     }
// };


let rootId = null;
const  idToNodeMap = {}

const addChildNodesforEachNode = function (dummyarray) {
    (dummyarray).forEach(element => {
        const { parentId, nodeId } = element;
        if (!_.isEmpty(parentId)) {
            const parentNode = idToNodeMap[parentId];
            const childNode = idToNodeMap[nodeId];
            parentNode.childs.push(childNode);
        }
    });
}

const depthForSearchTraversal = function (rootNode) {
    const responsechilds = [];
    (rootNode.childs).forEach(child => {
        responsechilds.push(depthForSearchTraversal(child));
    })
    return {
        service_name: rootNode.serviceId,
        apiName: rootNode.apiName,
        request: rootNode.requestObject,
        response: rootNode.responseObject,
        childs: responsechilds
    }
}
export const createGraph = function (dummyarray) {

    console.log("dummyarray",dummyarray)
    _.map(dummyarray, obj => {
        console.log("obj",obj)
        const { serviceId, apiName, requestObject, responseObject } = obj;
        idToNodeMap[obj.nodeId] = {
            serviceId,
            apiName,
            requestObject,
            responseObject,
            childs: []
        }
        if (_.isEmpty(obj.parentId) && !_.isEmpty(obj.nodeId)) {
            rootId = obj.nodeId;
        }
    });
    console.log("idToNodeMap",JSON.stringify(idToNodeMap))
    console.log("rootId",JSON.stringify(rootId))
    const rootNode = idToNodeMap[rootId];
    addChildNodesforEachNode(dummyarray);
    return depthForSearchTraversal(rootNode);
}


//console.log(createGraph(dummyarray));
