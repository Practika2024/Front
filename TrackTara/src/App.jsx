import { BrowserRouter } from "react-router-dom";
import "./App.css";
import BasicRoute from "./routes/BasicRoute";
import '@fortawesome/fontawesome-free/css/all.min.css';
function App() {
  return (
    <BrowserRouter>
      <BasicRoute />
    </BrowserRouter>
  );
}

export default App;
