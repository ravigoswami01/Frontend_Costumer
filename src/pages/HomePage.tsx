import { Hero } from '../components/sections/Hero';
import { Categories } from '../components/sections/Categories';
import { Deals } from '../components/sections/Deals';
import { BookingForm } from '../components/booking/BookingForm';

export const HomePage = () => {
  return (
    <div className="pt-16">
      <Hero />
      <Categories />
      <Deals />
      <BookingForm />
    </div>
  );
};
