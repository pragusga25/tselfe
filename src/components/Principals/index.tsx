import { useState } from 'react';
import { PrincipalType } from '@/types';
import { PrincipalGroupsTable } from './PrincipalGroupsTable';
import { PrincipalUsersTable } from './PrincipalUserssTable';
import { PrincipalUserModal } from './PrincipalUserModal';
import { PrincipalGroupModal } from './PrincipalGroupModal';
import { useSearchParams } from 'react-router-dom';

export const Principals = () => {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const isInitUser = typeParam === 'user' || typeParam === 'USER';

  const tabLists = [PrincipalType.GROUP, PrincipalType.USER];

  const [tabActive, setTabActive] = useState<PrincipalType>(
    isInitUser ? PrincipalType.USER : PrincipalType.GROUP
  );
  const isGroupActive = tabActive === PrincipalType.GROUP;

  const onChangeTabe = (tab: PrincipalType) => {
    setTabActive(tab);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        List Principal
        {isGroupActive ? ' Groups' : ' Users'}
      </h1>
      <div className="flex justify-end mb-2">
        {isGroupActive ? <PrincipalGroupModal /> : <PrincipalUserModal />}
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
        {isGroupActive ? <PrincipalGroupsTable /> : <PrincipalUsersTable />}
      </div>
    </div>
  );
};
