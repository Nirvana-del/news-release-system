import {BrowserRouter} from "react-router-dom";
import React from 'react';
import AppRouter from '@/router/index'
import AuthProvider from "@/components/Auth/AuthProvider";
import {Provider} from "react-redux";
import {persistor, store} from "@/redux";
import {PersistGate} from "redux-persist/integration/react";

const App:React.FC = () => {
    return (
        <div className="App">
            <BrowserRouter>
                <Provider store={store}>
                    <PersistGate persistor={persistor}>
                        <AuthProvider>
                            <AppRouter/>
                        </AuthProvider>
                    </PersistGate>
                </Provider>
            </BrowserRouter>
        </div>
    )
}
export default App
