import React from "react";
import {
  Routes,
  Route,
} from "react-router-dom";
import Login from "./pages/Login";
import TransactionCreate from "./pages/TransactionCreate";
import TransactionHistory from "./pages/TransactionHistory";
import TransactionDetail from "./pages/TransactionDetail";
import Notification from "./pages/Notification";
import Main from "./pages/Main";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Main component={TransactionHistory} />} />
      <Route path="/trx" element={<Main component={TransactionCreate}/>} />
      <Route path="/trx/:id" element={<Main component={TransactionDetail}/>} />

      <Route path="/login" element={<Login/>} />
      <Route path="/notification" element={<Notification/>} />
    </Routes>
  );
}

export default App;
