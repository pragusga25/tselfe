import { useListAssignmentRequests, useLogout, useMe } from '@/hooks';
import { RequestAssignmentStatus, Role } from '@/types';

export const Navbar = () => {
  const menuItems = [
    'Assignments',
    'Freezes',
    'Requests',
    'Accounts',
    'Settings',
  ];
  const { data } = useMe();
  const isAdmin = data?.role === Role.ADMIN;
  const logout = useLogout();

  const { data: assignmentRequests } = useListAssignmentRequests(isAdmin);

  const hasNotif = assignmentRequests
    ? assignmentRequests.filter(
        (req) => req.status === RequestAssignmentStatus.PENDING
      ).length > 0
    : 0;

  return (
    <nav className="flex items-center min-h-16 p-2 bg-base-100 border-b-2 border-base-200 shadow-lg">
      <div className="flex max-w-7xl mx-auto w-full h-full items-center">
        <div className="flex w-1/2 justify-start items-center">
          {isAdmin ? (
            <div className="dropdown mr-4">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle relative"
              >
                {hasNotif && (
                  <span className="w-2 h-2 bg-red-400 rounded-full absolute top-2 right-2" />
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                {menuItems.map((item) => (
                  <li key={item}>
                    <a href={`/${item.toLowerCase()}`} className="menu-item">
                      {item}
                      {hasNotif && item === 'Requests' && (
                        <span className="w-2 h-2 bg-red-400 rounded-full" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <span className="text-red-500">TSEL</span>
        </div>

        <div className="flex w-1/2 justify-end">
          <button className="btn btn-outline btn-error" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
