import logo from "../../assets/Logo.svg";

export default function Header() {
  return (
    <header className="bg-white shadow-md h-17 relative flex items-center border-b-2 border-[#E3E3E3]">
      <a className= "absolute left-4 md:left-12 flex items-center gap-x-2" href="/">
        <img src={logo} alt="Logo" className="w-6 sm:w-8 md:w-10 h-auto" />
        <span className="text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-[#1EACE3] to-[#152F6C] bg-clip-text text-transparent tracking-widest">
          SPACEFY
        </span>
      </a>
      <nav className="mx-auto flex gap-x-8 text-gray-600">
        <a href="#" className="relative group">
          Descobrir
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#1EACE3] scale-x-0 group-hover:scale-x-100 origin-left transition-all duration-300"></span>
        </a>
        <a href="#" className="relative group">
          Anunciar
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#1EACE3] scale-x-0 group-hover:scale-x-100 origin-left transition-all duration-300"></span>
        </a>
      </nav>

      <div className="absolute right-5 md:right-10 lg:right-30">
        <a href="/Cadastro" className="hover:text-blue-600">
          Cadastre-se
        </a>
      </div>
    </header>
  );
}
