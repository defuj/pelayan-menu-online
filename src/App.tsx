import React from "react";
import {
  Routes,
  Route,
} from "react-router-dom";
import Cart from "./pages/Cart";
import Home from './pages/Home';
import Main from "./pages/Main";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Main component={Home}/>} />
      <Route path="/:restoSlug" element={<Main component={Home}/>} />
      <Route path="/:restoSlug/cart" element={<Main component={Cart}/>} />
    </Routes>
  );
}

export default App;
