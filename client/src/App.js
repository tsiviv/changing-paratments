import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // import Routes במקום Switch
import HeadPage from './HeadPage';
import rootReducer from './features/rootSlice';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Register from './Register';
import Login from './Login'
import UserProfile from './personallArea';
;
function App() {
  const store = configureStore({
      reducer: rootReducer,
    })
  return (
    <Provider store={store}>
      <Router>
        <Routes> {/* השתמש ב- Routes במקום Switch */}
          <Route path="/" element={<HeadPage />} /> {/* השתמש ב-element כדי להציג את הקומפוננטה */}
          <Route path="/Register" element={<Register />} /> {/* השתמש ב-element כדי להציג את הקומפוננטה */}
          <Route path="/Login" element={<Login />} /> {/* השתמש ב-element כדי להציג את הקומפוננטה */}
          <Route path="/UserProfile" element={<UserProfile />} /> {/* השתמש ב-element כדי להציג את הקומפוננטה */}
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
