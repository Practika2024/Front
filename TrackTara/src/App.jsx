import { BrowserRouter } from "react-router-dom";
import "./App.css";
import BasicRoute from "./routes/BasicRoute";

function App() {
  return (
    <BrowserRouter>
      <BasicRoute />
    </BrowserRouter>
  );
}

export default App;
