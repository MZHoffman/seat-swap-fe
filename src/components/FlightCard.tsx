import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { FlightCardProps } from '../../lib/types';
import { useState } from 'react';
import Seat from './Seat';

export default function FlightCard({
  flight: {
    flightNumber,
    departureAirport,
    arrivalAirport,
    departureTime,
    arrivalTime,
    airline,
    seats,
    preferences,
  },
  handleDelete,
  handleRemoveFlight,
}: FlightCardProps) {
  const [showEditSeat, setShowEditSeat] = useState('');
  const [showEditPref, setShowEditPref] = useState(false);

  return (
    <Card>
      <CardContent>
        <Typography variant='h4' component='div' gutterBottom>
          {airline} - Flight {flightNumber}
          <Typography variant='body1'>
            Departure Airport: {departureAirport}
          </Typography>
          <Typography variant='body1'>
            Arrival Airport: {arrivalAirport}
          </Typography>
          <Typography variant='body1'>
            Departure Time: {departureTime}
          </Typography>
          <Typography variant='body1'>Arrival Time: {arrivalTime}</Typography>
          <Typography variant='h5'>Seats</Typography>
          {seats.map((seat, index) => (
            <Seat key={index} seat={seat} handleDelete={handleDelete} />
          ))}
          <Typography variant='h5'>
            Preferences
            <Button
              variant='contained'
              color='primary'
              onClick={() => setShowEditPref(!showEditPref)}
            >
              Edit Preferences
            </Button>
          </Typography>
          {preferences.map((preference, index) => (
            <Typography key={index} variant='body2'>
              Location: {preference.location} - Position: {preference.position}{' '}
              - {preference.extraLegroom ? 'Extra Legroom' : 'Standard Legroom'}{' '}
              -{' '}
              {preference.neighbouringRows
                ? 'Neighbouring Rows'
                : 'No Neighbouring Rows'}{' '}
              - {preference.sameRow ? 'Same Row' : 'Different Row'} -{' '}
              {preference.sideBySide ? 'Side by Side' : 'No Side by Side'}
            </Typography>
          ))}
          {showEditPref && <div>Edit Preferences Here</div>}
          <Button
            variant='contained'
            color='primary'
            onClick={handleRemoveFlight}
            value={flightNumber}
          >
            <DeleteIcon />
            Remove Flight
          </Button>
        </Typography>
      </CardContent>
    </Card>
  );
}
