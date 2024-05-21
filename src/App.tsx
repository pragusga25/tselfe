import { Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Assignments } from '@/components/Assignments';
import { Login } from './components/Login';
import { RedirectAuthenticated } from './components/RedirectAuthenticated';
import { Accounts } from './components/Accounts';
import { useAuth } from './hooks';
import { User } from './components/User';
import { AssignmentRequests } from './components/Assignments/Requests';
import { FreezeTimes } from './components/FreezeTimes';
import { Settings } from './components/Settings';
import { Role } from './types';
import { Principals } from './components/Principals';

function App() {
  const {
    auth: { user },
  } = useAuth();
  let isAdmin = user?.role === Role.ADMIN;

  return (
    <Routes>
      {isAdmin ? (
        <Route element={<Layout />}>
          <>
            <Route path="/" element={<Assignments />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/requests" element={<AssignmentRequests />} />
            <Route path="/freezes" element={<FreezeTimes />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/principals" element={<Principals />} />
          </>
        </Route>
      ) : null}
      {!isAdmin ? (
        <Route element={<Layout />}>
          <>
            <Route path="/" element={<User />} />
          </>
        </Route>
      ) : null}
      {/* <RedirectAuthenticated></RedirectAuthenticated> */}
      <Route element={<RedirectAuthenticated />}>
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
