import { useCreateAccountAdminBulk } from '@/hooks';
import { GroupMembershipModal } from '../Modal/GroupMembershipModal';

type AccountAdminModalProps = {
  existingUserIds?: Set<string>;
};
export const AccountAdminModal = ({
  existingUserIds,
}: AccountAdminModalProps) => {
  const { mutate, isPending, isSuccess } = useCreateAccountAdminBulk();
  return (
    <GroupMembershipModal
      modalTitle="Create Admin"
      modalId="create-admin-modal"
      mutate={mutate}
      mutateLoading={isPending}
      mutateSuccess={isSuccess}
      existingUserIds={existingUserIds}
      submitText="Create"
    />
  );
};

// import { useCreateAccountAdminBulk, useListPrincipalGroups } from '@/hooks';
// import { Modal } from '../Modal';
// import { FormEvent, useEffect, useMemo, useState } from 'react';

// export const AccountAdminModal = () => {
//   const { mutate, isPending, isSuccess } = useCreateAccountAdminBulk();
//   const { data: principalGroups, isLoading: isLoadingPrincipalGroups } =
//     useListPrincipalGroups();

//   const [groupId, setGroupId] = useState(principalGroups?.[0]?.id ?? '');
//   const [principalUserIds, setPrincipalUserIds] = useState<string[]>([]);

//   const selectedMemberships = useMemo(() => {
//     return (
//       principalGroups?.find((group) => group.id === groupId)?.memberships ?? []
//     );
//   }, [groupId, principalGroups]);

//   const isSelectedMembershipEmpty = selectedMemberships.length === 0;
//   const notSelectedGroup = groupId.length === 0;

//   const onChangeGroup = (e: FormEvent<HTMLSelectElement>) => {
//     setGroupId(e.currentTarget.value);
//   };

//   const onSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     mutate({ principalUserIds: principalUserIds });
//   };

//   useEffect(() => {
//     if (isSuccess) {
//       setPrincipalUserIds([]);
//     }
//   }, [isSuccess]);

//   useEffect(() => {
//     setPrincipalUserIds(selectedMemberships.map((mem) => mem.userId));
//   }, [selectedMemberships]);

//   return (
//     <>
//       <Modal id="createAdminModal" title="Create Admin">
//         <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
//           <div className="form-control">
//             <div className="label">
//               <span className="label-text">Select Group</span>
//             </div>
//             {isLoadingPrincipalGroups && (
//               <span className="loading loading-dots mx-auto loading-sm"></span>
//             )}
//             {!isLoadingPrincipalGroups && (
//               <select
//                 value={groupId}
//                 onChange={onChangeGroup}
//                 name="groupId"
//                 className="select select-bordered w-full"
//               >
//                 <option value="" className="hidden">
//                   Select Group
//                 </option>
//                 {principalGroups?.map((principal) => (
//                   <option key={principal.id} value={principal.id}>
//                     {principal.displayName}
//                   </option>
//                 ))}
//               </select>
//             )}
//           </div>

//           <div className="form-control">
//             <div className="label">
//               <span className="label-text">Select Users</span>
//             </div>
//             <div className="text-justify ml-1 text-sm">
//               <span>Select the users you want to make admin.</span>
//             </div>
//           </div>

//           <div className="overflow-x-auto mt-2">
//             {notSelectedGroup && 'Please select group first.'}
//             {isSelectedMembershipEmpty &&
//               !notSelectedGroup &&
//               'No users found in this group.'}
//             {!isSelectedMembershipEmpty && !notSelectedGroup && (
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>
//                       <label>
//                         <input
//                           type="checkbox"
//                           className="checkbox"
//                           onChange={(e) => {
//                             if (e.target.checked) {
//                               setPrincipalUserIds(
//                                 selectedMemberships.map(
//                                   (membership) => membership.userId
//                                 )
//                               );
//                             } else {
//                               setPrincipalUserIds([]);
//                             }
//                           }}
//                           checked={
//                             principalUserIds.length ===
//                               selectedMemberships?.length &&
//                             selectedMemberships.length !== 0
//                           }
//                         />
//                       </label>
//                     </th>
//                     <th>Id</th>
//                     <th>Display Name</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {selectedMemberships.map((membership) => (
//                     <tr key={membership.membershipId}>
//                       <td>
//                         <label>
//                           <input
//                             type="checkbox"
//                             className="checkbox"
//                             onChange={(e) => {
//                               if (e.target.checked) {
//                                 setPrincipalUserIds((prev) => [
//                                   ...prev,
//                                   membership.userId,
//                                 ]);
//                               } else {
//                                 setPrincipalUserIds((prev) =>
//                                   prev.filter((p) => p !== membership.userId)
//                                 );
//                               }
//                             }}
//                             checked={
//                               !!principalUserIds.find(
//                                 (pu) => pu === membership.userId
//                               )
//                             }
//                           />
//                         </label>
//                       </td>
//                       <td>{membership.userId}</td>
//                       <td>{membership.userDisplayName}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>

//           <div className="form-control">
//             <button className="btn btn-primary" disabled={isPending}>
//               {isPending && <span className="loading loading-spinner"></span>}
//               Create
//             </button>
//           </div>
//         </form>
//       </Modal>
//     </>
//   );
// };
