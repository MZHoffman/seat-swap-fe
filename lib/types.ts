export type PositionProps = 'window' | 'middle' | 'aisle' | '';
export type LocationProps = 'front' | 'center' | 'back' | '';

export type UserProps = {
  email: string;
  firstname: string;
  lastname: string;
  gender: number;
  phone: number;
  rating: number;
  created_at: string;
};

export type SeatProps = {
  extraLegroom?: boolean | null;
  id: number;
  location: LocationProps;
  position: PositionProps;
  seat_letter: string | null;
  seat_row: number | null;
  isEditing?: boolean;
  previous_user_name: string | null;
  previous_user_id: number | null;
  current_user_id: number | null;
  flight_id: number | null;
};

export type FlightProps = {
  flightnumber: string;
  departureairport: string;
  departureairportname: string;
  arrivalairportname: string;
  arrivalairport: string;
  departuretime: string;
  arrivaltime: string;
  airline: string;
  seats: SeatProps[];
  id: string;
};

export type FlightDetailsProps = {
  flightnumber: string;
  departureairport: string;
  departureairportname: string;
  arrivalairportname: string;
  arrivalairport: string;
  departuretime: string;
  arrivaltime: string;
  airline: string;
  id: string;
};

export type MatchProps = {
  current_seats: SeatProps;
  offer_seats: SeatProps[];
};

export type SideBySideMatchesProps = {
  side_by_side_matches: MatchProps[];
};

export type SameRowMatchesProps = {
  same_row_matches: MatchProps[];
};

export type NeighbouringRowsMatchesProps = {
  neighbouring_rows_matches: MatchProps[];
};

export type AllMatchesProps = {
  all_matches: MatchProps[];
};

export type OffersProps = {
  offers: MatchProps[];
  requested: MatchProps[];
  voided: MatchProps[];
};

export type FlightCardProps = {
  flight: FlightProps;
  handleRemoveFlight: React.MouseEventHandler<HTMLButtonElement>;
};
export type showEditSeat = (id: string) => void;
export type AddFlightProps = {
  handleAddFlight: (flight: FlightProps) => boolean;
  checkIfFlightIsThere: (
    flightNumber: string | null,
    departureTime: string
  ) => boolean;
};
export type GetToken = () => Promise<string>;
export type GetFlightDetails = (
  carrierCode: string,
  flightNumber: string,
  scheduledDepartureDate: string | undefined,
  headers: object
) => Promise<FlightProps | void>;

export type GetAirlineName = (
  carrierCode: string,
  headers: object
) => Promise<string | void>;
