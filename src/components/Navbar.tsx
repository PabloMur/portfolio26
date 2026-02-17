import Logo from "./Logo";
import NavbarUl from "./NavbarUl";

export default function Navbar() {
  return (
    <div className="w-full px-40 z-10">
      <nav
        className="w-full flex justify-between items-center bg-white  px-30 rounded-b-3xl"
        style={{
          clipPath: "polygon(0 0, 100% 0, 95% 100%, 5% 100%)"
        }}
      >
        <Logo />
        <NavbarUl />
      </nav>
    </div>
  );
}
