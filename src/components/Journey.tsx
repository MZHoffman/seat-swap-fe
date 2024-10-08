import { MouseEventHandler, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useOptimisticDeleteFlight } from '@/hooks/mutations';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';

import SeatCard from './SeatCard';

import { useLocation } from 'react-router-dom';

import { SeatProps } from '../../lib/types';

import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import FlightInfo from './FlightInfo';
import AddSeatForm from './AddSeatForm';
import EditSeatForm from './EditSeatForm';
import Offers from './Offers';
import Requests from './Requests';
import { Separator } from '@/components/ui/separator';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useJourney } from '@/hooks/queries';
import { usePatchJourney } from '@/hooks/mutations';
import FilterMatches from './FilterMatches';

export default function Journey() {
  const [seats, setSeats] = useState<SeatProps[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();

  const flight_id = location.state?.flight_id as string;
  const user_id = location.state?.user_id as number;

  const navigate = useNavigate();

  const FindJourneyQuery = useJourney(user_id, flight_id);

  const mutateUpdateJourney = usePatchJourney();
  const [seat, setSeat] = useState<SeatProps | null>(null);
  const [showEditSeatForm, setShowEditSeatForm] = useState(false);
  const [showAddSeatForm, setShowAddSeatForm] = useState(false);
  const [seatError, setSeatError] = useState<string | null>(null);

  const seatsSwapped = seats.filter((seat) => seat.previous_user_id !== null);

  const handleEditSeat = (seat: SeatProps) => {
    setSeat(seat);
    setShowEditSeatForm(true);
  };

  const cancelButton = (
    func: MouseEventHandler<HTMLButtonElement>
  ): JSX.Element => {
    return (
      <div className='flex justify-start ml-4'>
        <Button className='w-[330px]' onClick={func}>
          Cancel
        </Button>
      </div>
    );
  };

  const deleteJourneyMutation = useOptimisticDeleteFlight();

  const handleDeleteJourney = () => {
    deleteJourneyMutation.mutate({ user_id: 21, flight_id: +flight_id });
  };

  useEffect(() => {
    if (FindJourneyQuery.isLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      if (FindJourneyQuery.data && FindJourneyQuery.data.seats) {
        setSeats(FindJourneyQuery.data.seats);
      }
    }
  }, [FindJourneyQuery.data, FindJourneyQuery.isLoading]);

  useEffect(() => {
    if (mutateUpdateJourney.isSuccess) {
      setShowEditSeatForm(false);
    }
  }, [mutateUpdateJourney.isSuccess, setShowEditSeatForm]);

  useEffect(() => {
    if (mutateUpdateJourney.isError) {
      if (axios.isAxiosError(mutateUpdateJourney.error)) {
        setSeatError(
          mutateUpdateJourney.error.response?.data?.msg || 'An error occurred'
        );
      }
    }
  }, [mutateUpdateJourney.isError]);

  useEffect(() => {
    if (deleteJourneyMutation.isSuccess) {
      navigate('/');
    }
  }, [deleteJourneyMutation.isSuccess]);

  return (
    <div className='grid-flow-row'>
      <div className='grid justify-items-center'>
        <div className='grid lg:flex lg:flex-row lg:w-[1000px] justify-center'>
          <div className='min-w-[45%]'>
            <CardHeader className='mt-4'>
              <CardTitle>Heres your journey!</CardTitle>
              <CardDescription>
                Add seats, request swaps and accept offers
              </CardDescription>
            </CardHeader>
            {FindJourneyQuery?.data && (
              <FlightInfo flight={FindJourneyQuery.data} />
            )}
            <Separator orientation='horizontal' />
            {seatError && <div>{seatError}</div>}
            {isLoading ? (
              <div>Loading seats...</div>
            ) : (
              seats.length > 0 &&
              seats.map((seat: SeatProps, index) => (
                <SeatCard
                  setShowAddSeatForm={setShowAddSeatForm}
                  key={
                    seat.seat_row !== null && seat.seat_letter !== null
                      ? `${seat.seat_row}${seat.seat_letter}`
                      : index
                  }
                  seat={seat}
                  handleEditSeat={handleEditSeat}
                />
              ))
            )}
            <Button
              onClick={() => {
                setShowAddSeatForm(true);
                setShowEditSeatForm(false);
              }}
            >
              Add Seat
            </Button>{' '}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className='my-4' disabled={seatsSwapped.length > 0}>
                  Delete Flight
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete this flight?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                  This will delete all of your seats and this flight.
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <Button variant='outline'>Cancel</Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button variant='destructive' onClick={handleDeleteJourney}>
                      Delete
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {!showAddSeatForm && !showEditSeatForm && (
              <>
                <CardHeader>
                  <CardTitle>Offered seats!</CardTitle>
                  <CardDescription>
                    Check out the seats that you have been offered to swap with
                  </CardDescription>
                </CardHeader>
                <Offers user_id={21} flight_id={flight_id} />

                <CardHeader>
                  <CardTitle>Requested seats!</CardTitle>
                  <CardDescription>
                    Check out the seats that you have requested to swap with
                  </CardDescription>
                </CardHeader>
                <Requests user_id={21} flight_id={flight_id} />
              </>
            )}
          </div>

          <Separator
            className='my-4 lg:my-0 lg:mx-[50px] lg:h-auto lg:w-px max-w-[450px]'
            orientation='horizontal'
          />
          <div className='min-w-[45%] m-auto'>
            {!showAddSeatForm && !showEditSeatForm && (
              <>
                {seats.length > 0 && (
                  <CardHeader>
                    <CardTitle>Request seats!</CardTitle>
                    <CardDescription>
                      Use the filter below to help you choose a seat to swap
                      with
                    </CardDescription>
                  </CardHeader>
                )}
                {seats.length === 0 && (
                  <CardHeader>
                    <CardTitle>Add seats!</CardTitle>
                    <CardDescription>
                      Add seats to request swaps
                    </CardDescription>
                  </CardHeader>
                )}
              </>
            )}
            {showAddSeatForm && (
              <>
                <AddSeatForm
                  setShowAddSeatForm={setShowAddSeatForm}
                  flight_id={flight_id}
                />
                {cancelButton(() => setShowAddSeatForm(false))}
              </>
            )}
            {showEditSeatForm && seat && (
              <>
                <EditSeatForm
                  setShowEditSeatForm={setShowEditSeatForm}
                  seatToEdit={seat}
                  key={seat.id}
                />
                {cancelButton(() => setShowEditSeatForm(false))}
              </>
            )}
            {!showAddSeatForm && !showEditSeatForm && (
              <FilterMatches flight_id={flight_id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
