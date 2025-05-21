import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/src/components/ui/calendar';
import { Popover } from '@radix-ui/react-popover';
import { PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import { format } from "date-fns";
import { useMemo, useState } from 'react';
import type { Apartment } from '@/types/apartments';

type HeroHomeProps={
  apartments:Apartment[]
}
const HeroHome = ({apartments}:HeroHomeProps) => {
      const [checkIn, setCheckIn] = useState<Date | undefined>();
      const [checkOut, setCheckOut] = useState<Date | undefined>();

      const apartmentLocation=useMemo(()=>{
        const locations=Array.from(new Set(apartments.map((apt)=>apt.location)))
        return locations
      },[apartments])
  return (
     <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Find Your Perfect Stay
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Discover luxury apartments and unique stays around the world
        </p>

        <div className="bg-muted backdrop-blur-md p-4 rounded-lg items-center shadow-md flex flex-wrap gap-2 md:gap-4  justify-center max-w-4xl">
          <select className="px-4 py-2 text-sm rounded-md border bg-white border-gray-300 text-muted-foreground">
            <option value="">Location</option>
            {apartmentLocation.map((location)=>(
              <option key={location} value={location}>{location}</option>
            ))}
           
          </select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-40 justify-start text-left font-normal text-muted-foreground"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkIn ? format(checkIn, 'PPP') : 'Check in'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-40 justify-start text-left font-normal text-muted-foreground"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOut ? format(checkOut, 'PPP') : 'Check out'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button className="bg-black px-15 text-white hover:bg-gray-800 ">
            Search
          </Button>
        </div>
      </div>
  )
}

export default HeroHome