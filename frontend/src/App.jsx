import {Route, Routes, BrowserRouter} from 'react-router-dom';

import MainWrapper from './layouts/MainWrapper';
import PrivateRoute from './layouts/PrivateRoute';

import Login from './views/auth/Login';
import Register from './views/auth/Register';
import Logout from './views/auth/Logout';
import ForgotPassword from './views/auth/ForgotPassword';
import CreateNewPassword from './views/auth/CreateNewPassword';


function App() {
    return (
        <BrowserRouter>
            <MainWrapper>
                <Routes>
                    <Route path="/" element={<div>Home</div>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/password/reset/confirm/:uidb64/:token/" element={<CreateNewPassword />} />

                    <Route path="/profile" element={<PrivateRoute><div>Profile</div></PrivateRoute>} />
                </Routes>
            </MainWrapper>
        </BrowserRouter>
    );
}  

export default App;
