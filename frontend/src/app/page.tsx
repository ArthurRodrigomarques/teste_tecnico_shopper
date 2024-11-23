import MapLayout from "@/components/mapLayout";
import SearchAddress from "@/components/searchAddress";

export default function Home() {
  return (
    <div className="grid grid-cols-[40%_60%] w-screen items-center justify-items-center bg-slate-900 overflow-hidden">
      <SearchAddress />
      <MapLayout />
    </div>
  );
}
