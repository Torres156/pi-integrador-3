import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { NotFound } from '../pages/not-found';
import { Login } from '../pages/login';
import { Home } from '../pages/dashboard/home';
import { Reports } from '../pages/dashboard/reports';
import { Customers } from '../pages/dashboard/customers';
import { Products } from '../pages/dashboard/products';
import { CreateProducts } from '../pages/dashboard/products/create';
import { HomeCustomer } from '../pages/dashboard/home/index-customer';
import { CreateSchedule } from '../pages/dashboard/agendar';
import { useContext, useEffect } from 'react';
import { UserContext } from './hooks/userProvider';
import { EditProducts } from '../pages/dashboard/products/edit';
import { NewAccount } from '../pages/new-account';
import { EditCustomers } from '../pages/dashboard/customers/edit';

export default function AppRoutes() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  function RouteOrLogin({ children }) {

    useEffect(() => {
      if (user === undefined) return;
      if (user === null)
        navigate("/login");

    }, [user, navigate])

    if (!user)
      return null;

    return (children)
  }

  function VerifyLogin({ children }) {

    useEffect(() => {
      if (user !== null)
        navigate("/");
    }, [user, navigate])

    return (children)
  }

  return (
    <Routes>

      <Route path='/login' element={<VerifyLogin><Login /></VerifyLogin>} />
      <Route path='/new-account' element={<NewAccount />} />

      {user?.access == 1 ? (<>
        <Route path='/' element={<RouteOrLogin><Home /></RouteOrLogin>} />
        <Route path='/reports' element={<RouteOrLogin><Reports /></RouteOrLogin>} />
        <Route path='/customers' element={<RouteOrLogin><Customers /></RouteOrLogin>} />
        <Route path='/customers/edit/:id' element={<RouteOrLogin><EditCustomers /></RouteOrLogin>} />

        <Route path='/products' element={<RouteOrLogin><Products /></RouteOrLogin>} />
        <Route path='/products/create' element={<RouteOrLogin><CreateProducts /></RouteOrLogin>} />
        <Route path='/products/edit/:id' element={<RouteOrLogin><EditProducts /></RouteOrLogin>} />
      </>) : (<>
        <Route path='/' element={<RouteOrLogin><HomeCustomer /></RouteOrLogin>} />
        <Route path='/agendar' element={<RouteOrLogin><CreateSchedule /></RouteOrLogin>} />
      </>)}


      {/* Página 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>

  );
}

