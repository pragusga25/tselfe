import { useListAccountAdmins } from '@/hooks';
import { AccountTable } from './AccountTable';
import { AccountAdminModal } from './AccountAdminModal';
import { useMemo } from 'react';

export const AccountAdminTable = () => {
  const { data, isLoading, search, searchResult, onSearch } =
    useListAccountAdmins();

  const existingUserIds = useMemo(() => {
    const userIds = data?.map((user) => user.principalId ?? '') ?? [];

    return new Set(userIds);
  }, [data]);
  return (
    <>
      <AccountAdminModal existingUserIds={existingUserIds} />
      <AccountTable
        data={data}
        isFetching={isLoading}
        search={search}
        searchResult={searchResult}
        onSearch={onSearch}
      />
    </>
  );
};
