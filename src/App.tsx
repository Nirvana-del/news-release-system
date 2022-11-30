import {BrowserRouter} from "react-router-dom";
import React from 'react';
import AppRouter from '@/router/index'

export default function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    </div>
  )
}
