import { useState } from 'react';
import { Role } from '@/types';
import { AccountUserModal } from './AccountUserModal';
import { AccountAdminModal } from './AccountAdminModal';
import { AccountUserTable } from './AccountUserTable';
import { AccountAdminTable } from './AccountAdminTable';

export const Accounts = () => {
  const tabLists = [Role.USER, Role.ADMIN];

  const [tabActive, setTabActive] = useState<Role>(Role.USER);
  const isUserActive = tabActive === Role.USER;

  const onChangeTabe = (tab: Role) => {
    setTabActive(tab);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        List {isUserActive ? 'User' : 'Admin'}
      </h1>
      <div className="flex justify-end mb-2">
        {isUserActive ? <AccountUserModal /> : <AccountAdminModal />}
      </div>
      <div role="tablist" className="tabs tabs-boxed my-4">
        {tabLists.map((tab) => (
          <a
            role="tab"
            className={`tab ${tab === tabActive ? 'tab-active' : ''}`}
            onClick={() => onChangeTabe(tab)}
            key={tab}
          >
            {tab}
          </a>
        ))}
      </div>

      <div className="overflow-x-auto mb-4">
        {isUserActive ? <AccountUserTable /> : <AccountAdminTable />}
      </div>
    </div>
  );
};
