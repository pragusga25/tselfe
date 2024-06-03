export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum PrincipalType {
  USER = 'USER',
  GROUP = 'GROUP',
}

export enum RequestAssignmentOperation {
  ATTACH = 'ATTACH',
  DETACH = 'DETACH',
}

export enum RequestAssignmentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum FreezeTimeTarget {
  USER = 'USER',
  GROUP = 'GROUP',
  ALL = 'ALL',
}

export type PrincipalAccount = {
  principalId: string;
  awsAccountId: string;
  principalType: PrincipalType;
  id: string;
};

export type PrincipalAccountDetail = PrincipalAccount & {
  awsAccountName: string;
  principalDisplayName: string;
};

export type OkResponse = {
  ok: true;
};
export type IdResponse = {
  id: string;
};

export type PermissionSet = {
  arn: string;
  name?: string;
};

export type PermissionSets = PermissionSet[];

export type Assignment = {
  id: string;
  permissionSets: {
    arn: string;
    name: string;
  }[];
  principalId: string;
  principalType: PrincipalType;
  principalDisplayName: string;
  awsAccountId: string;
  awsAccountName: string;
  createdAt: string;
  updatedAt: string;
  lastPushedAt: string | null;
};

export type User = {
  id: string;
  username: string;
  name: string;
  role: Role;
};
export interface UserWithTimeStamps extends User {
  createdAt: string;
  updatedAt: string;
}
export interface UserWithPassword extends User {
  password: string;
}
export type ListAssignmentsData = Assignment[];
export type LoginData = {
  accessToken: string;
  user: User;
};
export type LoginPayload = {
  username: string;
  password: string;
};
export type CreateUserPayload = Omit<UserWithPassword, 'id'>;
export type CreateAccountUserPayload = {
  name: string;
  username: string;
  password: string;
  principalAwsAccountUsers: Omit<PrincipalAccount, 'id'>[];
};
export type UpdateAccountUserPayload = {
  id: string;
  name: string;
  username: string;
  principalAwsAccountUserIdsToBeDeleted?: string[];
  principalAwsAccountsToBeAdded?: {
    principalId: string;
    principalType: 'USER' | 'GROUP';
    awsAccountId: string;
  }[];
};
export type UpdateAccountUserData = OkResponse;
export type CreateAccountUserData = IdResponse;
export type CreateAccountAdminPayload = {
  name: string;
  username: string;
  password: string;
};
export type CreateAccountAdminData = IdResponse;
export type CreatePrincipalPayload = {
  displayName: string;
  type: PrincipalType;
  username?: string;
  givenName?: string;
  familyName?: string;
};
export type UpdatePrincipalPayload = {
  displayName: string;
  type: PrincipalType;
  id: string;
};
export type CreatePrincipalGroupPayload = {
  displayName: string;
  description?: string;
};
export type UpdatePrincipalGroupPayload = CreatePrincipalGroupPayload & {
  id: string;
  membershipIdsToBeDeleted?: string[];
  userIdsToBeAdded?: string[];
};
export type CreatePrincipalUserPayload = {
  displayName: string;
  username: string;
  givenName: string;
  familyName: string;
};
export type UpdatePrincipalUserPayload = Omit<
  CreatePrincipalUserPayload,
  'username'
> & {
  id: string;
  groupIdsToBeAdded?: string[];
  membershipIdsToBeDeleted?: string[];
};
export type DeletePrincipalPayload = {
  type: PrincipalType;
  id: string;
};
export type ListAssignmentGroupsData = Assignment[];
export type ListAssignmentUsersData = Assignment[];

export type DeletePrincipalData = OkResponse;
export type UpdatePrincipalData = OkResponse;
export type UpdatePrincipalGroupData = OkResponse;
export type UpdatePrincipalUserData = OkResponse;
export type CreatePrincipalGroupData = IdResponse;
export type CreatePrincipalUserData = IdResponse;
export type CreatePrincipalData = IdResponse;
export type RequestAssignmentPayload = {
  permissionSetArns: string[];
  operation: RequestAssignmentOperation;
  note?: string;
  principalAwsAccountUserId: string;
};

export type AcceptAssignmentRequestsPayload = {
  ids: string[];
  operation: RequestAssignmentOperation;
};

export type RejectAssignmentRequestsPayload = {
  ids: string[];
};

export type DeleteAssignmentRequestsPayload = {
  ids: string[];
};
export type DeleteAssignmentPayload = {
  id: string;
};

export type DeleteAssignmentData = OkResponse;
export type RegisterPayload = Omit<UserWithPassword, 'id'>;
export type RegisterData = IdResponse;
export type GetUserData = User;
export type MeData = User & {
  principalAwsAccountUsers: {
    principalId: string;
    principalType: string;
    awsAccountId: string[];
    awsAccountName: string[];
    permissionSets: PermissionSets;
    principalDisplayName: string;
    id: string;
  }[];
};
export type ListUsersData = UserWithTimeStamps[];
export type ListAccountUsersData = {
  id: string;
  name: string;
  username: string;
  principalAwsAccountUsers: PrincipalAccountDetail[];
  createdAt: string;
}[];
export type ListAccountAdminsData = {
  id: string;
  name: string;
  username: string;
  createdAt: string;
}[];
export type CreateUserData = IdResponse;
export type RequestAssignmentData = IdResponse;
export type AcceptAssignmentRequestsData = OkResponse;
export type RejectAssignmentRequestsData = OkResponse;
export type DeleteAssignmentRequestsData = OkResponse;
export type DeleteUsersPayload = {
  ids: string[];
};
export type DeleteUsersData = OkResponse;
export type PrincipalGroup = {
  id: string;
  displayName: string;
  description: string | null;
  principalType: PrincipalType.GROUP;
};

export type PrincipalAwsAccountUserDetail = {
  principalId: string;
  awsAccountId: string;
  principalType: PrincipalType;
  permissionSets: PermissionSets;
  principalDisplayName: string;
  awsAccountName: string;
};

export type PrincipalUser = {
  id: string;
  displayName: string;
  name: {
    givenName: string;
    familyName: string;
  };
  username: string;
  principalType: PrincipalType.USER;
};
// export type ListPrincipalsData = {
//   id: string;
//   displayName: string;
//   principalType: PrincipalType;
// }[];
export type ListPrincipalsData = PrincipalGroup[] | PrincipalUser[];
export type AwsAccount = {
  id: string;
  name: string;
};
export type ListAwsAccountsData = AwsAccount[];
export type ListPrincipalUsersData = (PrincipalUser & {
  memberships: {
    groupId: string;
    membershipId: string;
    groupDisplayName: string;
  }[];
})[];
export type ListPrincipalGroupsData = (PrincipalGroup & {
  memberships: {
    userId: string;
    membershipId: string;
    userDisplayName: string;
  }[];
})[];
export type ListPrincipalsNotInDbData = {
  id: string;
  displayName: string;
  type: PrincipalType;
}[];
export type ListPermissionSetsData = PermissionSets;
export type ListMyPermissionSetsData = PrincipalAwsAccountUserDetail[];
type AssignmentRequestData = {
  id: string;
  permissionSets: PermissionSets;
  operation: RequestAssignmentOperation;
  status: RequestAssignmentStatus;
  principalId: string;
  principalType: PrincipalType;
  principalDisplayName: string;
  awsAccountId: string;
  awsAccountName: string;
  note: string | null;
  requestedAt: string;
  respondedAt: string | null;
  responder: {
    name: string;
    username: string;
  } | null;
};
export type ListMyAssignmentRequestsData = AssignmentRequestData[];
interface AssignmentRequestWithRequesterData extends AssignmentRequestData {
  requester: {
    name: string;
    username: string;
  };
}

export type CountAssignmentRequestsData = {
  count: number;
};

export type CountAssignmentRequestsQuery = {
  status?: RequestAssignmentStatus;
};

export type UpdateUserPrincipalPayload = {
  userId: string;
  principalId: string;
  principalType: PrincipalType;
};

export type UpdateUserPrincipalData = OkResponse;

export type ListAssignmentRequestsData = AssignmentRequestWithRequesterData[];
export type GetIdentityInstanceData = {
  instanceArn: string;
  identityStoreId: string;
};
export type UpsertIdentityInstancePayload = GetIdentityInstanceData;
export type ListFreezeTimesData = {
  id: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    name: string;
  };
  name: string;
  target: FreezeTimeTarget;
  permissionSets: PermissionSets;
  startTime: string;
  endTime: string;
  excludedPrincipals:
    | {
        id: string;
        type: PrincipalType;
        displayName: string;
      }[]
    | null;
}[];
export type CreateFreezeTimePayload = {
  name: string;
  target: FreezeTimeTarget;
  permissionSetArns: string[];
  startTime: string;
  endTime: string;
  excludedPrincipals?: {
    id: string;
    type: PrincipalType;
  }[];
};
export type CreateFreezeTimeData = OkResponse;
export type DeleteFreezeTimesPayload = {
  ids: string[];
};
export type DeleteFreezeTimesData = OkResponse;
export type UpsertIdentityInstanceData = OkResponse;
export type UpdateUserPasswordPayload = {
  oldPassword: string;
  newPassword: string;
};
export type UpdateUserPasswordData = OkResponse;
export type EditAssignmentPayload = {
  permissionSetArns: string[];
  id: string;
};
export type EditAssignmentData = OkResponse;
export type PushOneAssignmentPayload = {
  id: string;
};
export type PushOneAssignmentData = OkResponse;
export type CreateAssignmentPayload = {
  permissionSetArns: string[];
  principalId: string;
  principalType: PrincipalType;
  awsAccountId: string;
};
export type CreateAssignmentData = IdResponse;
