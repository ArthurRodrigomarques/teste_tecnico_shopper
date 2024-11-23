import ThemeToggle from "./themeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function NavBar() {
  return (
    <div>
      <div className="flex w-full pt-4 pb-4 pl-5 pr-5 items-center justify-between bg-secondary">
        <div className="pl-10">
            <ThemeToggle/>
        </div>
        
        <div className="flex items-center gap-4 pr-10">
          <div className="text-right">
            <p>arthur</p>
            <p>arthur@gmail.com</p>
          </div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
