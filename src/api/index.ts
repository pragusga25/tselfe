import {
  AcceptAssignmentRequestsData,
  AcceptAssignmentRequestsPayload,
  CountAssignmentRequestsData,
  CountAssignmentRequestsQuery,
  CreateAssignmentData,
  CreateAssignmentPayload,
  CreateFreezeTimeData,
  CreateFreezeTimePayload,
  CreatePrincipalData,
  CreatePrincipalPayload,
  CreateUserData,
  CreateUserPayload,
  DeleteAssignmentData,
  DeleteAssignmentPayload,
  DeleteAssignmentRequestsData,
  DeleteAssignmentRequestsPayload,
  DeleteFreezeTimesData,
  DeleteFreezeTimesPayload,
  DeletePrincipalData,
  DeletePrincipalPayload,
  DeleteUsersData,
  DeleteUsersPayload,
  EditAssignmentPayload,
  GetIdentityInstanceData,
  GetUserData,
  ListAssignmentRequestsData,
  ListAssignmentsData,
  ListFreezeTimesData,
  ListMyAssignmentRequestsData,
  ListMyPermissionSetsData,
  ListPermissionSetsData,
  ListPrincipalsData,
  ListPrincipalsNotInDbData,
  ListUsersData,
  LoginData,
  LoginPayload,
  OkResponse,
  PushOneAssignmentPayload,
  RegisterData,
  RegisterPayload,
  RejectAssignmentRequestsData,
  RejectAssignmentRequestsPayload,
  RequestAssignmentData,
  RequestAssignmentPayload,
  UpdatePrincipalData,
  UpdatePrincipalPayload,
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

// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async function (error) {
//     const originalRequest = error.config;
//     console.log('ERROR INTERCEPTOR: ', error);
//     if (
//       error.response.status === 401 &&
//       error.response.data.error.code === 'auth/access-token-expired' &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;
//       const response = await apiPrivate.get('/auth.refresh');
//       console.log('REFRESH RESPONSE: ', response);
//       const access_token = response.data.result.accessToken;
//       axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
//       return api(originalRequest);
//     }
//     return Promise.reject(error);
//   }
// );

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

export const getMe = (accessToken?: string): Promise<GetUserData> =>
  api
    .get(`/auth.me`, {
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
    .post(`/users.delete`, data, {
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
    .post(`/users.password.update`, data, {
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
