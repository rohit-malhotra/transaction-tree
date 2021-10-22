import logo from './logo.svg';
import './App.css';
import { Demo } from './graph'
const data = {
  "service_name": "growth_service",
  "request": {},
  "response": {},
  "childs": [{
    "service_name": "customer-pre-request-service",
    "request": {},
    "response": {},
    "childs": [{
      "service_name": "cart-service",
      "request": {},
      "response": {},
      "childs": [{
        "service_name": "catalog-service",
        "request": {},
        "response": {}
      }]
    },
      {
        "service_name": "catalog-service",
        "request": {},
        "response": {}
      }
    ]
  }]
}
function App() {
  return (
    <div className="App">
      <Demo data={data}></Demo>
    </div>
  );
}
export default App;
