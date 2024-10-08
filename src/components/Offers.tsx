import { MatchProps, SeatProps } from 'lib/types';
import OfferCard from './OfferCard';
import { useOffers } from '@/hooks/queries';
import axios from 'axios';

const Offers = ({
  user_id,
  flight_id,
}: {
  user_id: number;
  flight_id: string;
}) => {
  const offers = useOffers(user_id, flight_id);

  const transformMatches = (matches: MatchProps[] | undefined) => {
    if (!matches) return;
    return matches.flatMap((seat) =>
      seat.offer_seats.map((offer_seat) => [seat.current_seats, offer_seat])
    );
  };
  const offers_formatted = transformMatches(offers.data?.offers);
  if (axios.isAxiosError(offers.error)) {
    return <div>{offers.error.response?.data?.msg || 'An error occurred'}</div>;
  }
  return (
    <>
      {offers_formatted &&
        offers_formatted.map((match: SeatProps[], index: number) => {
          return <OfferCard key={index + 'filtered'} match={match} />;
        })}
    </>
  );
};

export default Offers;
