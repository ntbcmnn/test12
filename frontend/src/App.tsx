import './App.css';
import Toolbar from './components/UI/Toolbar/Toolbar.tsx';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './containers/LoginPage/LoginPage.tsx';
import RegisterPage from './containers/RegisterPage/RegisterPage.tsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';
import { useAppSelector } from './app/hooks.ts';
import { selectUser } from './store/slices/usersSlice.ts';
import AddPicture from './containers/AddPicture/AddPicture.tsx';
import Home from './containers/Home/Home.tsx';
import UserPictures from './containers/UserPictures/UserPictures.tsx';

const App = () => {
  const user = useAppSelector(selectUser);
  return (
    <>
      <Toolbar/>
      <div className="my-5">
        <Routes>
          <Route path="/" element={<Home/>}/>
           <Route path="/pictures" element={<UserPictures/>}/>
          <Route
            path="/pictures/new"
            element={
              <ProtectedRoute
                isAllowed={
                  user &&
                  (user.role === 'admin' || user.role === 'user')
                }
              >
                <AddPicture/>
              </ProtectedRoute>
            }/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="*" element={<h2 className="text-center mt-5" style={{color: '#4389cc'}}>Page not found</h2>}/>
        </Routes>
      </div>
    </>
  );
};

export default App;