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
import { Logs } from './components/Logsc';
import { Approvers } from './components/Approvers';
import { NotFound } from './components/NotFound';
import { PermissionSets } from './components/PermissionSets';
import { PersistLogin } from './components/PersistLogin';

function App() {
  const {
    auth: { user },
  } = useAuth();
  let isAdmin = user?.role === Role.ADMIN;

  return (
    <Routes>
      {isAdmin ? (
        <Route
          element={
            <PersistLogin>
              <Layout />
            </PersistLogin>
          }
        >
          <>
            <Route path="/" element={<Assignments />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/requests" element={<AssignmentRequests />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/approvers" element={<Approvers />} />
            <Route path="/freezes" element={<FreezeTimes />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/principals" element={<Principals />} />
            <Route path="/permission-sets" element={<PermissionSets />} />
            <Route path="/logs" element={<Logs />} />
          </>
        </Route>
      ) : null}
      {!isAdmin ? (
        <Route
          element={
            <PersistLogin>
              <Layout />
            </PersistLogin>
          }
        >
          <>
            <Route path="/" element={<User />} />
            <Route path="/settings" element={<User />} />
            <Route path="/requests" element={<AssignmentRequests />} />
          </>
        </Route>
      ) : null}

      <Route element={<RedirectAuthenticated />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
