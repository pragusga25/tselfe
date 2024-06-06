import { useListAccountUsers } from '@/hooks';
import { AccountTable } from './AccountTable';
import { AccountUserModal } from './AccountUserModal';

export const AccountUserTable = () => {
  const { data, isLoading, search, searchResult, onSearch } =
    useListAccountUsers();

  return (
    <>
      <AccountUserModal />
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
