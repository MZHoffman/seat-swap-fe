import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteFlightByUserFlightId,
  postJourney,
  postSwapRequest,
  updateFlightByUserFlightId,
  patchSwapRequest,
} from '../api/seatSwapAPI';
import { FlightProps } from '../../lib/types';

export function useOptimisticDeleteFlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFlightByUserFlightId,
    onMutate: async (params: { user_id: number; flight_id: number }) => {
      await queryClient.cancelQueries({ queryKey: ['getFlightsByUser'] });
      const previousFlights = queryClient.getQueryData<FlightProps[]>([
        'getFlightsByUser',
      ]);
      if (previousFlights) {
        queryClient.setQueryData(
          ['getFlightsByUser'],
          previousFlights.filter((f) => Number(f.id) !== params.flight_id)
        );
      }
      return { previousFlights: previousFlights || [] };
    },
    onError: (error, params, context) => {
      console.log('🚀 ~ useOptimisticDeleteFlight ~ params:', params);
      console.log('🚀 ~ useOptimisticDeleteFlight ~ error:', error);
      if (context?.previousFlights) {
        queryClient.setQueryData(['getFlightsByUser'], context.previousFlights);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['getFlightsByUser'] });
    },
  });
}

export function usePostJourney() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postJourney,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['getFlightsByUser'] });
      return data;
    },
    onError: (err) => {
      console.log('🚀 ~ .onError ~ err:', err);
    },
  });
}

export function usePatchJourney() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFlightByUserFlightId,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['getFlightsByUser'] });
      return data;
    },
    onError: (err) => {
      throw err;
    },
  });
}

export function usePostSwapRequest(
  your_seat_id: number,
  matched_seat_id: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postSwapRequest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['getMatchStatus', your_seat_id, matched_seat_id],
      });
      return data;
    },
    onError: (err) => {
      console.log('🚀 ~ .onError ~ err:', err);
    },
  });
}
export function usePatchSwapRequest(
  your_seat_id: number,
  matched_seat_id: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchSwapRequest,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getMatchStatus', your_seat_id, matched_seat_id],
      });
      if (variables.body.action === 'accept') {
        Promise.all([
          queryClient.invalidateQueries({ queryKey: ['getFlightsByUser'] }),
          queryClient.invalidateQueries({ queryKey: ['side_bySide_matches'] }),
          queryClient.invalidateQueries({ queryKey: ['same_row_matches'] }),
          queryClient.invalidateQueries({
            queryKey: ['neighbouring_rows_matches'],
          }),
          queryClient.invalidateQueries({ queryKey: ['offers'] }),
        ]);
      }
      return data;
    },
    onError: (err) => {
      console.log('🚀 ~ .onError ~ err:', err);
    },
  });
}
