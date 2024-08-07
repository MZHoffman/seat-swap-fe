import { Typography, CardContent, Card } from '@mui/material';

import FlightCard from './FlightCard';
import AddFlight from './AddFlight';
import { useFlightsByUserId } from '../hooks/queries';
import { useOptimisticDeleteFlight } from '../hooks/mutations';
import axios from 'axios';
import { Button } from './ui/button';

const Flights = () => {
  const FlightsByUserIdQuery = useFlightsByUserId(21);

  const deleteFlightMutation = useOptimisticDeleteFlight();

  const handleRemoveFlight: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    const flight_id = Number(event.currentTarget.value);
    deleteFlightMutation.mutate({ user_id: 21, flight_id });
  };

  return (
    <Card>
      <Button>test</Button>
      <CardContent>
        <Typography variant='h2' gutterBottom>
          Flights
        </Typography>
        {FlightsByUserIdQuery.isSuccess &&
          FlightsByUserIdQuery.data?.map((flight) => {
            return (
              <FlightCard
                key={flight.id}
                flight={flight}
                handleRemoveFlight={handleRemoveFlight}
              />
            );
          })}
        {FlightsByUserIdQuery.isError &&
          axios.isAxiosError(FlightsByUserIdQuery.error) && (
            <Typography variant='body1' color='error'>
              {FlightsByUserIdQuery.error.response?.data?.msg ||
                FlightsByUserIdQuery.error.message}
            </Typography>
          )}
        <AddFlight flights={FlightsByUserIdQuery.data || []} />
      </CardContent>
    </Card>
  );
};

export default Flights;
