import GoogleMapsComponent from "@/components/googleMapLayout";
import SearchAddress from "@/components/searchAddress";

export default function Home() {
  return (
    <div className="flex w-full  overflow-hidden pl-[10%]">
      
      <div className="flex w-[80%] h-full">
        <div className="w-[30%] h-full flex items-center justify-center p-4">
          <SearchAddress />
        </div>

        <div className="w-[70%] h-full">
          <GoogleMapsComponent
            center={{ lat: -23.55052, lng: -46.633308 }} // Centro de SP
          />
        </div>
      </div>

  
    </div>
  );
}
