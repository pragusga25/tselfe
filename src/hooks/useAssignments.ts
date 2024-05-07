import {
  acceptAssignmentRequests,
  deleteAssignmentRequests,
  listAssignmentRequests,
  listAssignments,
  listMyAssignmentRequests,
  pullAssignments,
  pushAssignments,
  rejectAssignmentRequests,
  requestAssignment,
} from '@/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';
import {
  AcceptAssignmentRequestsPayload,
  DeleteAssignmentRequestsPayload,
  RejectAssignmentRequestsPayload,
  RequestAssignmentPayload,
} from '@/types';

export const useListAssignments = () => {
  const {
    auth: { accessToken },
  } = useAuth();
  const query = useQuery({
    queryKey: ['assignments.list'],
    queryFn: () => listAssignments(accessToken),
  });

  return query;
};

export const usePullAssignments = () => {
  const queryClient = useQueryClient();
  const {
    auth: { accessToken },
  } = useAuth();
  const mutation = useMutation({
    mutationFn: () => pullAssignments(accessToken),
    mutationKey: ['assignments.pull'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['assignments.list'],
      });
      toast.success('Assignments pulled successfully');
    },
  });

  return mutation;
};

export const usePushAssignments = () => {
  const {
    auth: { accessToken },
  } = useAuth();
  const mutation = useMutation({
    mutationFn: () => pushAssignments(accessToken),
    mutationKey: ['assignments.push'],
    onSuccess: async () => {
      toast.success('Assignments pushed successfully');
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

export const useListAssignmentRequests = (enabled = true) => {
  const {
    auth: { accessToken },
  } = useAuth();
  const query = useQuery({
    queryKey: ['assignment-requests.list'],
    queryFn: () => listAssignmentRequests(accessToken),
    enabled,
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
      acceptAssignmentRequests(data, accessToken),
    mutationKey: ['assignment-requests.accept'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['assignment-requests.list'],
      });
      toast.success('Assignment requests accepted successfully');
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
      rejectAssignmentRequests(data, accessToken),
    mutationKey: ['assignment-requests.reject'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['assignment-requests.list'],
      });
      toast.success('Assignment requests rejected successfully');
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
      deleteAssignmentRequests(data, accessToken),
    mutationKey: ['assignment-requests.delete'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['assignment-requests.my-list'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['assignment-requests.list'],
      });
      toast.success('Assignment requests deleted successfully');
    },
  });

  return mutation;
};
