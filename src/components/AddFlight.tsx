import { useState } from 'react';

import { TextField, Button, Typography } from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { getFlightDetails } from '../api/seatSwapAPI';

import { useQuery } from '@tanstack/react-query';
import { FlightProps } from '../../lib/types';

import FlightForm from './FlightForm';

export default function AddFlight({
  flights,
}: {
  flights: FlightProps[] | null;
}) {
  const [flightNumberAndCarrierCode, setFlightNumberAndCarrierCode] =
    useState('FR9336');
  const [departureDate, setDepartureDate] = useState<Dayjs | null>(
    dayjs('2022-10-01')
  );

  const [openFlightSearch, setOpenFlightSearch] = useState(false);
  const [showFlightForms, setShowFlightForms] = useState(false);

  const [flightDetails, setFlightDetails] = useState<FlightProps | null>(null);
  const [isJourneyExists, setIsJourneyExists] = useState(false);

  const findFlightDetails = () => {
    // this is checking if the flight is not there already before querying DB and api
    if (!flights) return;
    if (!departureDate) return;
    const doesjourneyExists = flights.filter((journey: FlightProps) => {
      const flightNumberMatch =
        journey.flightnumber === flightNumberAndCarrierCode;
      const departureDateMatch =
        dayjs(journey.departuretime).format('YYYY-MM-DD') ===
        departureDate?.format('YYYY-MM-DD');
      return flightNumberMatch && departureDateMatch;
    });
    console.log(
      '🚀 ~ findFlightDetails ~ doesjourneyExists:',
      doesjourneyExists
    );
    if (doesjourneyExists.length > 0) {
      setFlightDetails(doesjourneyExists[0]);
      setIsJourneyExists(true);
      setShowFlightForms(false);
      return;
    }
    refetch(); //IF ITS NOT ITS QUERYING THE DB WITH REACT QUERY
    // setFlightDetails(flightsData);
  };

  if (!departureDate) return;

  const scheduledDepartureDate = departureDate?.format('YYYY-MM-DD');
  const {
    data: flightsData,
    isSuccess,
    error,
    isError,
    refetch,
  } = useQuery({
    queryFn: () =>
      getFlightDetails({
        flightNumber: flightNumberAndCarrierCode,
        date: scheduledDepartureDate,
      }),
    queryKey: ['getFlightDetails'],
    enabled: false,
  });
  console.log('🚀 ~  data: ', flightsData, isSuccess, error, isError);
  if (isError) return <p>Error</p>;
  if (isSuccess) () => setFlightDetails(flightsData); // I DONT THINK THIS IS RIGHT CAN CREATE ISSUES
  if (!openFlightSearch)
    return (
      <Button
        onClick={() => {
          setOpenFlightSearch(true);
        }}
      >
        <Add /> Add Flight
      </Button>
    );

  // const handleSubmitFlightChanges = (flightDetails: FlightProps): void => {
  //   handleAddFlight(flightDetails);
  //   setFlightDetails(null);
  //   setFlightNumberAndCarrierCode('');
  //   setDepartureDate(null);
  //   setOpen(false);
  // };
  console.log('AAAAAAAAAAAAAAAAAAA', flightDetails);
  console.log('🚀 ~ BBBBBBBBB:', flightsData);

  return (
    <>
      <TextField
        InputLabelProps={{ shrink: true }}
        id='outlined-controlled'
        label='Flight Number'
        value={flightNumberAndCarrierCode}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setFlightNumberAndCarrierCode(event.target.value);
        }}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          format='DD-MM-YYYY'
          value={departureDate}
          label='Date'
          onChange={(newDate) => setDepartureDate(newDate)}
        />
      </LocalizationProvider>
      <Button onClick={() => findFlightDetails()}>Find flight Details</Button>
      {showFlightForms && (
        <Button
          onClick={() => {
            setOpenFlightSearch(false);
          }}
        >
          <Close /> Cancel
        </Button>
      )}
      {flightDetails !== null && ( // BUT I NEED IT HERE TO SHOW FORMS
        <>
          <Typography>
            {flightDetails?.airline} - {flightDetails?.departureairport} -{'>'}
            {flightDetails?.arrivalairport}
            {!setIsJourneyExists && !showFlightForms && (
              <Button onClick={() => setShowFlightForms(true)}>
                This is my flight!
              </Button>
            )}
            {isJourneyExists && ' This flight has already been added'}
          </Typography>
          {showFlightForms && (
            <FlightForm
              flight={flightDetails}
              setIsEditing={setShowFlightForms}
            />
          )}
        </>
      )}
    </>
  );
}
