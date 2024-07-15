import { useAuth, useCountAssignmentRequests, useLogout } from '@/hooks';
import { Role } from '@/types';
import { useMemo } from 'react';

export const Navbar = () => {
  const {
    auth: { user: data },
  } = useAuth();

  const menuItems = useMemo(() => {
    const isRoot = !!data?.isRoot;
    const isAdmin = !!(data?.role == Role.ADMIN);
    const isApprover = !!data?.isApprover;
    const showRequests = !!data?.isRoot || !!data?.isApprover;

    let menu: string[] = [];

    if (isRoot || isAdmin) {
      menu = [
        'Assignments',
        'Freezes',
        'Principals',
        'Accounts',
        'Approvers',
        'Permission Sets',
        'Logs',
        'Settings',
      ];

      if (isRoot || isApprover) {
        menu.splice(3, 0, 'Requests');
      }
    }

    if (!isAdmin) {
      menu = ['Settings'];

      if (showRequests) {
        menu.unshift('Requests');
      }
    }

    return menu;
  }, [data?.isApprover, data?.isRoot]);

  const logout = useLogout();

  const { data: assignmentRequestsCount } = useCountAssignmentRequests();
  const count = assignmentRequestsCount?.count ?? 0;

  const hasNotif = count > 0;

  return (
    <nav className="flex items-center min-h-16 p-2 bg-base-100 border-b-2 border-base-200 shadow-lg">
      <div className="flex max-w-7xl mx-auto w-full h-full items-center">
        <div className="flex w-1/2 justify-start items-center">
          <div className="dropdown mr-4">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle relative"
            >
              {hasNotif && (
                <span className="w-4 h-4 text-xs text-center text-black font-bold bg-red-400 rounded-full absolute top-2 right-2">
                  {count}
                </span>
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
                  <a
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="menu-item"
                  >
                    {item}
                    {hasNotif && item === 'Requests' && (
                      <span className="w-4 h-4 text-xs text-center text-black font-bold bg-red-400 rounded-full">
                        {count}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

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
