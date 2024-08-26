import { encodeQueryData } from '@/lib/utils';
import {
  AcceptAssignmentRequestsData,
  AcceptAssignmentRequestsPayload,
  AcceptAssignmentUserRequestPayload,
  CountAssignmentRequestsData,
  CountAssignmentRequestsQuery,
  CreateAccountAdminBulkPayload,
  CreateAccountAdminData,
  CreateAccountAdminPayload,
  CreateAccountUserData,
  CreateAccountUserPayload,
  CreateApproversPayload,
  CreateAssignmentData,
  CreateAssignmentPayload,
  CreateAssignmentUserRequestPayload,
  CreateFreezeTimeData,
  CreateFreezeTimePayload,
  CreatePrincipalData,
  CreatePrincipalGroupData,
  CreatePrincipalGroupPayload,
  CreatePrincipalPayload,
  CreatePrincipalUserData,
  CreatePrincipalUserPayload,
  CreateTimeInHourPayload,
  CreateUserData,
  CreateUserPayload,
  DeleteApproverPayload,
  DeleteAssignmentData,
  DeleteAssignmentPayload,
  DeleteAssignmentRequestsData,
  DeleteAssignmentRequestsPayload,
  DeleteAssignmentUserRequestPayload,
  DeleteFreezeTimesData,
  DeleteFreezeTimesPayload,
  DeletePrincipalData,
  DeletePrincipalPayload,
  DeleteTimeInHourPayload,
  DeleteUsersData,
  DeleteUsersPayload,
  EditAssignmentPayload,
  GetAssignmentUserRequestFormDataData,
  GetIdentityInstanceData,
  ListAccountAdminsData,
  ListAccountUsersData,
  ListApproversData,
  ListAssignmentGroupsData,
  ListAssignmentRequestsData,
  ListAssignmentUserRequestsData,
  ListAssignmentUsersData,
  ListAssignmentsData,
  ListAwsAccountsData,
  ListFreezeTimesData,
  ListLogsData,
  ListMyAssignmentRequestsData,
  ListMyPermissionSetsData,
  ListPermissionSetsData,
  ListPrincipalGroupsData,
  ListPrincipalUsersData,
  ListPrincipalsData,
  ListPrincipalsNotInDbData,
  ListTimeInHoursData,
  ListUsersData,
  LoginData,
  LoginPayload,
  MeData,
  OkResponse,
  PushOneAssignmentPayload,
  Query,
  RegisterData,
  RegisterPayload,
  RejectAssignmentRequestsData,
  RejectAssignmentRequestsPayload,
  RejectAssignmentUserRequestPayload,
  RequestAssignmentData,
  RequestAssignmentPayload,
  ResetAccountUserPasswordPayload,
  UpdateAccountUserData,
  UpdateAccountUserPayload,
  UpdatePermissionSetPayload,
  UpdatePrincipalData,
  UpdatePrincipalGroupData,
  UpdatePrincipalGroupPayload,
  UpdatePrincipalPayload,
  UpdatePrincipalUserData,
  UpdatePrincipalUserPayload,
  UpdateUserPasswordData,
  UpdateUserPasswordPayload,
  UpdateUserPrincipalData,
  UpdateUserPrincipalPayload,
  UpsertIdentityInstanceData,
  UpsertIdentityInstancePayload,
} from '@/types';
import axios from 'axios';
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

const axiosConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const api = axios.create(axiosConfig);

export const apiPrivate = axios.create({
  ...axiosConfig,
  withCredentials: true,
});

export const listAssignments = (
  accessToken?: string
): Promise<ListAssignmentsData> => {
  return api
    .get('/assignments.list', {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    })
    .then((res) => res.data.result);
};

export const listAssignmentGroups = (
  accessToken?: string
): Promise<ListAssignmentGroupsData> => {
  return api
    .get('/assignments.groups.list', {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    })
    .then((res) => res.data.result);
};

export const listAssignmentUsers = (
  accessToken?: string
): Promise<ListAssignmentUsersData> => {
  return api
    .get('/assignments.users.list', {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    })
    .then((res) => res.data.result);
};

export const pullAssignments = (accessToken?: string): Promise<OkResponse> => {
  return api
    .post(
      '/assignments.pull',
      {
        force: true,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then((res) => res.data);
};

export const pushAssignments = (accessToken?: string): Promise<OkResponse> => {
  return api
    .post(
      '/assignments.push',
      {
        force: true,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then((res) => res.data);
};

export const editAssignment = (
  data: EditAssignmentPayload,
  accessToken?: string
): Promise<OkResponse> => {
  return api
    .post('/assignments.edit', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data);
};

export const pushOneAssignment = (
  data: PushOneAssignmentPayload,
  accessToken?: string
): Promise<OkResponse> => {
  return api
    .post('/assignments.push-one', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data);
};

export const login = (payload: LoginPayload): Promise<LoginData> =>
  apiPrivate.post('/auth.login', payload).then((res) => res.data.result);

export const register = (payload: RegisterPayload): Promise<RegisterData> =>
  apiPrivate.post('/auth.register', payload).then((res) => res.data.result);

export const getMe = (accessToken?: string): Promise<MeData> =>
  apiPrivate
    .get(`/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const listUsers = (accessToken?: string): Promise<ListUsersData> =>
  api
    .get(`/users.list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const listAccountUsers = (
  accessToken?: string
): Promise<ListAccountUsersData> =>
  api
    .get(`/users.list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const listAccountAdmins = (
  accessToken?: string
): Promise<ListAccountAdminsData> =>
  api
    .get(`/admins.list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const listPrincipals = (
  accessToken?: string
): Promise<ListPrincipalsData> =>
  api
    .get(`/principals.list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const listAwsAccounts = (
  accessToken?: string
): Promise<ListAwsAccountsData> =>
  api
    .get(`/aws-accounts.list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const listPrincipalGroups = (
  accessToken?: string,
  q?: Query
): Promise<ListPrincipalGroupsData> => {
  let qs = '';
  if (q) {
    qs = encodeQueryData(q);
  }
  return api
    .get(`/principals.groups.list?${qs}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);
};

export const listPrincipalUsers = (
  accessToken?: string
): Promise<ListPrincipalUsersData> =>
  api
    .get(`/principals.users.list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const listPrincipalsNotInDb = (
  accessToken?: string
): Promise<ListPrincipalsNotInDbData> =>
  api
    .get(`/principals.list-not-in-db`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const deleteUsers = (
  data: DeleteUsersPayload,
  accessToken?: string
): Promise<DeleteUsersData> =>
  api
    .post(`/accounts.delete`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data);

export const createUser = (
  data: CreateUserPayload,
  accessToken?: string
): Promise<CreateUserData> =>
  api
    .post(`/auth.register`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const createAccountUser = (
  data: CreateAccountUserPayload,
  accessToken?: string
): Promise<CreateAccountUserData> =>
  api
    .post(`/users.create`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const resetAccountUserPassword = (
  data: ResetAccountUserPasswordPayload,
  accessToken?: string
): Promise<OkResponse> =>
  api
    .post(`/users.password.reset`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const synchronizeAccountUser = (
  accessToken?: string
): Promise<OkResponse> =>
  api
    .post(
      `/users.synchronize`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then((res) => res.data.result);

export const updateAccountUser = (
  data: UpdateAccountUserPayload,
  accessToken?: string
): Promise<UpdateAccountUserData> =>
  api
    .post(`/users.update`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const createAccountAdmin = (
  data: CreateAccountAdminPayload,
  accessToken?: string
): Promise<CreateAccountAdminData> =>
  api
    .post(`/admins.create`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const createAccountAdminBulk = (
  data: CreateAccountAdminBulkPayload,
  accessToken?: string
): Promise<OkResponse> =>
  api
    .post(`/admins.create-bulk`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const createApprovers = (
  data: CreateApproversPayload,
  accessToken?: string
): Promise<OkResponse> =>
  api
    .post(`/approvers.create`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const deleteApprover = (
  data: DeleteApproverPayload,
  accessToken?: string
): Promise<OkResponse> =>
  api
    .post(`/approvers.delete`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const listApprovers = (
  accessToken?: string
): Promise<ListApproversData> =>
  api
    .get(`/approvers.list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const listPermissionSets = (
  accessToken?: string
): Promise<ListPermissionSetsData> =>
  api
    .get(`/permission-sets.list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const getAssignmentUserRequestFormData = (
  accessToken?: string
): Promise<GetAssignmentUserRequestFormDataData> =>
  api
    .get(`/assignment-user-requests.get-form-data`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const createAssignmentUserRequest = (
  payload: CreateAssignmentUserRequestPayload,
  accessToken?: string
): Promise<OkResponse> =>
  api
    .post(`/assignment-user-requests.create`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const deleteAssignmentUserRequest = (
  payload: DeleteAssignmentUserRequestPayload,
  accessToken?: string
): Promise<OkResponse> =>
  api
    .post(`/assignment-user-requests.delete`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const rejectAssignmentUserRequest = (
  payload: RejectAssignmentUserRequestPayload,
  accessToken?: string
): Promise<OkResponse> =>
  api
    .post(`/assignment-user-requests.reject`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const acceptAssignmentUserRequest = (
  payload: AcceptAssignmentUserRequestPayload,
  accessToken?: string
): Promise<OkResponse> =>
  api
    .post(`/assignment-user-requests.accept`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const updatePermissionSet = (
  payload: UpdatePermissionSetPayload,
  accessToken?: string
): Promise<OkResponse> =>
  api
    .post(`/permission-sets.update`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const deleteTimeInHour = (
  payload: DeleteTimeInHourPayload,
  accessToken?: string
): Promise<OkResponse> =>
  api
    .post(`/time-in-hours.delete`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const createTimeInHour = (
  payload: CreateTimeInHourPayload,
  accessToken?: string
): Promise<OkResponse> =>
  api
    .post(`/time-in-hours.create`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const listTimeInHours = (
  accessToken?: string
): Promise<ListTimeInHoursData> =>
  api
    .get(`/time-in-hours.list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const listAssignmentUserRequests = (
  accessToken?: string
): Promise<ListAssignmentUserRequestsData> =>
  api
    .get(`/assignment-user-requests.list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const listMyAssignmentUserRequests = (
  accessToken?: string
): Promise<ListAssignmentUserRequestsData> =>
  api
    .get(`/assignment-user-requests.my-list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const requestAssignment = (
  data: RequestAssignmentPayload,
  accessToken?: string
): Promise<RequestAssignmentData> =>
  api
    .post(`/assignments.request`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const deleteAssignment = (
  data: DeleteAssignmentPayload,
  accessToken?: string
): Promise<DeleteAssignmentData> =>
  api
    .post(`/assignments.delete`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const createAssignment = (
  data: CreateAssignmentPayload,
  accessToken?: string
): Promise<CreateAssignmentData> =>
  api
    .post(`/assignments.create`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const listMyPermissionSets = (
  accessToken?: string
): Promise<ListMyPermissionSetsData> =>
  api
    .get(`/permission-sets.my-list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const listMyAssignmentRequests = (
  accessToken?: string
): Promise<ListMyAssignmentRequestsData> =>
  api
    .get(`/assignment-requests.my-list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const listAssignmentRequests = (
  accessToken?: string
): Promise<ListAssignmentRequestsData> =>
  api
    .get(`/assignment-requests.list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const countAssignmentRequests = (
  query: CountAssignmentRequestsQuery,
  accessToken?: string
): Promise<CountAssignmentRequestsData> => {
  return api
    .get(`/assignment-requests.count`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: query,
    })
    .then((res) => res.data.result);
};

export const acceptAssignmentRequests = (
  data: AcceptAssignmentRequestsPayload,
  accessToken?: string
): Promise<AcceptAssignmentRequestsData> =>
  api
    .post(`/assignment-requests.accept`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const rejectAssignmentRequests = (
  data: RejectAssignmentRequestsPayload,
  accessToken?: string
): Promise<RejectAssignmentRequestsData> =>
  api
    .post(`/assignment-requests.reject`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const deleteAssignmentRequests = (
  data: DeleteAssignmentRequestsPayload,
  accessToken?: string
): Promise<DeleteAssignmentRequestsData> =>
  api
    .post(`/assignment-requests.delete`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const listFreezeTimes = (
  accessToken?: string
): Promise<ListFreezeTimesData> =>
  api
    .get(`/freeze-times.list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const createFreezeTime = (
  data: CreateFreezeTimePayload,
  accessToken?: string
): Promise<CreateFreezeTimeData> =>
  api
    .post(`/freeze-times.create`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const deleteFreezeTimes = (
  data: DeleteFreezeTimesPayload,
  accessToken?: string
): Promise<DeleteFreezeTimesData> =>
  api
    .post(`/freeze-times.delete`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const getIdentityInstance = (
  accessToken?: string
): Promise<GetIdentityInstanceData> =>
  api
    .get(`/identity-instance.get`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result)
    .catch(() => {
      return {
        instanceArn: '',
        identityStoreId: '',
      };
    });

export const upsertIdentityInstance = (
  data: UpsertIdentityInstancePayload,
  accessToken?: string
): Promise<UpsertIdentityInstanceData> =>
  api
    .post(`/identity-instance.upsert`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const updateUserPassword = (
  data: UpdateUserPasswordPayload,
  accessToken?: string
): Promise<UpdateUserPasswordData> =>
  api
    .post(`/accounts.password.update`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const updateUserPrincipal = (
  data: UpdateUserPrincipalPayload,
  accessToken?: string
): Promise<UpdateUserPrincipalData> =>
  api
    .post(`/users.principal.update`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const createPrincipal = (
  data: CreatePrincipalPayload,
  accessToken?: string
): Promise<CreatePrincipalData> =>
  api
    .post(`/principals.create`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const updatePrincipal = (
  data: UpdatePrincipalPayload,
  accessToken?: string
): Promise<UpdatePrincipalData> =>
  api
    .post(`/principals.update`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const createPrincipalGroup = (
  data: CreatePrincipalGroupPayload,
  accessToken?: string
): Promise<CreatePrincipalGroupData> =>
  api
    .post(`/principals.groups.create`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const createPrincipalUser = (
  data: CreatePrincipalUserPayload,
  accessToken?: string
): Promise<CreatePrincipalUserData> =>
  api
    .post(`/principals.users.create`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const updatePrincipalGroup = (
  data: UpdatePrincipalGroupPayload,
  accessToken?: string
): Promise<UpdatePrincipalGroupData> =>
  api
    .post(`/principals.groups.update`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const updatePrincipalUser = (
  data: UpdatePrincipalUserPayload,
  accessToken?: string
): Promise<UpdatePrincipalUserData> =>
  api
    .post(`/principals.users.update`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const deletePrincipal = (
  data: DeletePrincipalPayload,
  accessToken?: string
): Promise<DeletePrincipalData> =>
  api
    .post(`/principals.delete`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.result);

export const listLogs = (
  {
    pageParam = 0,
    from,
    to,
  }: { pageParam: number; from?: number; to?: number },
  accessToken?: string
): Promise<ListLogsData> => {
  const params = new URLSearchParams({
    cursor: pageParam.toString(),
  });

  if (typeof from === 'number' && from >= 0) {
    params.append('from', from.toString());
  }

  if (typeof to === 'number' && to >= 0) {
    params.append('to', to.toString());
  }

  const paramString = params.toString();

  return api
    .get(`/logs.list?${paramString}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data);
};
