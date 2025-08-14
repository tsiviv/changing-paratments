import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { GoogleOAuthProvider } from '@react-oauth/google';

import rootReducer from '../../react-project/src/features/rootSlice';
import HeadPage from './pages/HeadPage';
import Register from './pages/Register';
import Login from './pages/Login';
import UserProfile from './pages/personallArea';
import NavbarHead from './pages/Navbar';
import ResetPassword from './pages/ResetPassword';
import './styles/app.css';

function App() {
  const store = configureStore({
    reducer: rootReducer,
  });

  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId="482512567613-7sb403cnibb5576hb4oidbhpouc6su9b.apps.googleusercontent.com">
        <Router>
          <NavbarHead />
          <Routes>
            <Route path="/" element={<HeadPage />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/UserProfile" element={<UserProfile />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </Provider>
  );
}

export default App;
