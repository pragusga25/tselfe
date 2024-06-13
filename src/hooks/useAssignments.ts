import {
  acceptAssignmentRequests,
  countAssignmentRequests,
  createAssignment,
  deleteAssignment,
  deleteAssignmentRequests,
  editAssignment,
  listAssignmentGroups,
  listAssignmentRequests,
  listAssignmentUsers,
  listAssignments,
  listMyAssignmentRequests,
  pullAssignments,
  pushAssignments,
  pushOneAssignment,
  rejectAssignmentRequests,
  requestAssignment,
} from '@/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';
import {
  AcceptAssignmentRequestsPayload,
  CreateAssignmentPayload,
  DeleteAssignmentPayload,
  DeleteAssignmentRequestsPayload,
  EditAssignmentPayload,
  PushOneAssignmentPayload,
  RejectAssignmentRequestsPayload,
  RequestAssignmentPayload,
  RequestAssignmentStatus,
  Role,
} from '@/types';
import { ChangeEvent, useMemo, useState } from 'react';
import { useMe } from './useUsers';

export const useListAssignments = () => {
  const {
    auth: { accessToken, user },
  } = useAuth();

  const query = useQuery({
    queryKey: ['assignments.list'],
    queryFn: () => listAssignments(accessToken),
    enabled: user?.role === Role.ADMIN,
  });

  const [search, setSearch] = useState('');

  const searchResult = useMemo(() => {
    return query.data?.filter(
      ({ awsAccountName, permissionSets, principalDisplayName }) => {
        const searchTargetLower = `${awsAccountName} ${permissionSets
          .map((ps) => ps.arn)
          .join(', ')} ${principalDisplayName}`.toLowerCase();

        return searchTargetLower.includes(search.toLowerCase());
      }
    );
  }, [query.data, search]);

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return {
    ...query,
    searchResult,
    onSearch,
    search,
  };
};

export const useListAssignmentGroups = () => {
  const {
    auth: { accessToken, user },
  } = useAuth();
  const query = useQuery({
    queryKey: ['assignments.groups.list'],
    queryFn: () => listAssignmentGroups(accessToken),
    enabled: user ? user?.role === Role.ADMIN : false,
  });

  return query;
};

export const useListAssignmentUsers = () => {
  const {
    auth: { accessToken, user },
  } = useAuth();
  const query = useQuery({
    queryKey: ['assignments.groups.list'],
    queryFn: () => listAssignmentUsers(accessToken),
    enabled: user ? user?.role === Role.ADMIN : false,
  });

  return query;
};

export const usePullAssignments = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();
  const mutation = useMutation({
    mutationFn: () =>
      toast.promise(pullAssignments(accessToken), {
        loading: 'Pulling assignments...',
        success: 'Assignments pulled successfully',
        error: 'Error pulling assignments',
      }),
    mutationKey: ['assignments.pull'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['assignments.list'],
      });
    },
  });

  return mutation;
};

export const usePushAssignments = () => {
  const {
    auth: { accessToken },
  } = useAuth();
  const mutation = useMutation({
    mutationFn: () =>
      toast.promise(pushAssignments(accessToken), {
        loading: 'Pushing assignments...',
        success: 'Assignments pushed successfully',
        error: 'Error pushing assignments',
      }),
    mutationKey: ['assignments.push'],
  });

  return mutation;
};

export const useEditAssignment = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();
  const mutation = useMutation({
    mutationFn: (data: EditAssignmentPayload) =>
      toast.promise(editAssignment(data, accessToken), {
        loading: 'Editing assignment...',
        success: 'Assignments edited successfully',
        error: 'Error editing assignment',
      }),
    mutationKey: ['assignments.edit'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['assignments.list'],
      });
    },
  });

  return mutation;
};

export const usePushOneAssignment = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();
  const mutation = useMutation({
    mutationFn: (data: PushOneAssignmentPayload) =>
      toast.promise(pushOneAssignment(data, accessToken), {
        loading: 'Pushing assignment...',
        success: 'Assignment pushed successfully',
        error: 'Error pushing assignment',
      }),
    mutationKey: ['assignments.push'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['assignments.list'],
      });
    },
  });

  return mutation;
};

export const useRequestAssignment = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();

  const mutation = useMutation({
    mutationFn: (payload: RequestAssignmentPayload) =>
      requestAssignment(payload, accessToken),
    mutationKey: ['assignments.request'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['assignment-requests.my-list'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['assignment-requests.count'],
      });
      toast.success('Assignment requested successfully');
    },
  });

  return mutation;
};

export const useListMyAssignmentRequests = () => {
  const {
    auth: { accessToken },
  } = useAuth();
  const query = useQuery({
    queryKey: ['assignment-requests.my-list'],
    queryFn: () => listMyAssignmentRequests(accessToken),
  });

  return query;
};

export const useListAssignmentRequests = () => {
  const { data: user } = useMe();
  const {
    auth: { accessToken },
  } = useAuth();
  const query = useQuery({
    queryKey: ['assignment-requests.list'],
    queryFn: () => listAssignmentRequests(accessToken),
    enabled: !!user?.isApprover || user?.isApprover,
  });

  return query;
};

export const useCountAssignmentRequests = () => {
  const { data: user } = useMe();
  const {
    auth: { accessToken },
  } = useAuth();
  const query = useQuery({
    queryKey: ['assignment-requests.count'],
    queryFn: () =>
      countAssignmentRequests(
        {
          status: RequestAssignmentStatus.PENDING,
        },
        accessToken
      ),
    enabled: !!user?.isApprover || user?.isApprover,
  });

  return query;
};

export const useAcceptAssignmentRequests = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();
  const mutation = useMutation({
    mutationFn: (data: AcceptAssignmentRequestsPayload) =>
      toast.promise(acceptAssignmentRequests(data, accessToken), {
        loading: 'Accepting assignment requests...',
        success: 'Assignment requests accepted successfully',
        error: 'Error accepting assignment requests',
      }),
    mutationKey: ['assignment-requests.accept'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['assignment-requests.list'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['assignment-requests.count'],
      });
    },
  });

  return mutation;
};

export const useRejectAssignmentRequests = () => {
  const queryClient = useQueryClient();

  const {
    auth: { accessToken },
  } = useAuth();

  const mutation = useMutation({
    mutationFn: (data: RejectAssignmentRequestsPayload) =>
      toast.promise(rejectAssignmentRequests(data, accessToken), {
        loading: 'Rejecting assignment requests...',
        success: 'Assignment requests rejected successfully',
        error: 'Error rejecting assignment requests',
      }),
    mutationKey: ['assignment-requests.reject'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['assignment-requests.list'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['assignment-requests.count'],
      });
    },
  });

  return mutation;
};

export const useDeleteAssignmentRequests = () => {
  const queryClient = useQueryClient();

  const {
    auth: { accessToken },
  } = useAuth();

  const mutation = useMutation({
    mutationFn: (data: DeleteAssignmentRequestsPayload) =>
      toast.promise(deleteAssignmentRequests(data, accessToken), {
        loading: 'Deleting assignment requests...',
        success: 'Assignment requests deleted successfully',
        error: 'Error deleting assignment requests',
      }),
    mutationKey: ['assignment-requests.delete'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['assignment-requests.my-list'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['assignment-requests.list'],
      });
    },
  });

  return mutation;
};

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();

  const {
    auth: { accessToken },
  } = useAuth();

  const mutation = useMutation({
    mutationFn: (data: DeleteAssignmentPayload) =>
      toast.promise(deleteAssignment(data, accessToken), {
        loading: 'Deleting assignment ...',
        success: 'Assignment deleted successfully',
        error: 'Error deleting assignment ',
      }),
    mutationKey: ['assignments.delete'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['assignments.list'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['principals.list-not-in-db'],
      });
    },
  });

  return mutation;
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();

  const {
    auth: { accessToken },
  } = useAuth();

  const mutation = useMutation({
    mutationFn: (data: CreateAssignmentPayload) =>
      toast.promise(createAssignment(data, accessToken), {
        loading: 'Creating assignment ...',
        success: 'Assignment created successfully',
        error: 'Error creating assignment ',
      }),
    mutationKey: ['assignments.create'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['assignments.list'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['principals.list-not-in-db'],
      });
    },
  });

  return mutation;
};
