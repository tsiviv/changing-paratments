import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // import Routes במקום Switch
import HeadPage from './pages/HeadPage';
import rootReducer from '../../react-project/src/features/rootSlice';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Register from './pages/Register';
import Login from './pages/Login'
import UserProfile from './pages/personallArea';
import NavbarHead from './pages/Navbar';
import ResetPassword from './pages/ResetPassword';
import './styles/app.css'
function App() {
  const store = configureStore({
      reducer: rootReducer,
    })
  return (
    <Provider store={store}>
      <Router>
        <NavbarHead/>
        <Routes> {/* השתמש ב- Routes במקום Switch */}
          <Route path="/" element={<HeadPage />} /> {/* השתמש ב-element כדי להציג את הקומפוננטה */}
          <Route path="/Register" element={<Register />} /> {/* השתמש ב-element כדי להציג את הקומפוננטה */}
          <Route path="/Login" element={<Login />} /> {/* השתמש ב-element כדי להציג את הקומפוננטה */}
          <Route path="/UserProfile" element={<UserProfile />} /> {/* השתמש ב-element כדי להציג את הקומפוננטה */}
          <Route path="/reset-password" element={<ResetPassword />} /> {/* השתמש ב-element כדי להציג את הקומפוננטה */}

        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
