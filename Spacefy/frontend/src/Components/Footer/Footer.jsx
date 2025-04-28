import Logo from "../../assets/Logo.svg";
import { FaFacebookF, FaPinterestP, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";


function Footer() {

    // Lista de redes sociais
    const socialLinks = [
        { icon: <FaFacebookF className="text-xl" />, link: "https://www.facebook.com/" },
        { icon: <FaPinterestP className="text-xl" />, link: "https://www.pinterest.com/" },
        { icon: <FaTwitter className="text-xl" />, link: "https://www.twitter.com/" },
        { icon: <FaYoutube className="text-xl" />, link: "https://www.youtube.com/" },
        { icon: <FaInstagram className="text-xl" />, link: "https://www.instagram.com/" },
  ];

      
    return (
    <footer className="border-t border-gray-200 py-12">
            <div className="container mx-auto px-4">
            {/* Logo e Linha Superior */}
            <div className="border-t border-[#00A3FF] pt-8 mt-8 mb-8 flex items-center gap-4">
                <img src={Logo} alt="Spacefy" className="h-12" />
                <span className="text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-[#1EACE3] to-[#152F6C] bg-clip-text text-transparent tracking-widest">
                SPACEFY
                </span>
            </div>

                {/* Grid de Links */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8 border-b border-[#00A3FF] pb-8">
                {/* Spacefy */}
                <div>
                <h3 className="font-bold mb-4">Spacefy</h3>
                <ul className="space-y-2">
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]">Quem somos</a></li>
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]">Cadastro/Login</a></li>
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]">Trabalhe conosco</a></li>
                </ul>
                </div>

                {/* Hospedagem */}
                <div>
                <h3 className="font-bold mb-4">Hospedagem</h3>
                <ul className="space-y-2">
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]">Mais bem avaliados</a></li>
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]">Quadras poliesportivas</a></li>
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]">Locais para festas</a></li>
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]">Casas de show</a></li>
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]">Anuncie seu espaço</a></li>
                </ul>
                </div>

                {/* Central de Atendimento */}
                <div>
                <h3 className="font-bold mb-4">Central de Atendimento</h3>
                <ul className="space-y-2">
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]">Central de Ajuda</a></li>
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]">Contate-nos</a></li>
                    <li><span className="text-gray-600">(00) 0000 - 0000</span></li>
                    <li><span className="text-gray-600">Segunda a Sexta: 08h às 18h</span></li>
                    <li><span className="text-gray-600">Sábados e Feriados Nacionais: 09h às 16h</span></li>
                </ul>
                </div>

                {/* Termos */}
                <div>
                <h3 className="font-bold mb-4">Termos</h3>
                <ul className="space-y-2">
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]">Termos de uso do site</a></li>
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]">Política de privacidade</a></li>
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]">Política de Cancelamento e Reembolso</a></li>
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]">Política de Pagamento</a></li>
                </ul>
                </div>

                {/* App */}
                <div>
                <h3 className="font-bold mb-4">App</h3>
                <ul className="space-y-2">
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]">Baixe o nosso aplicativo</a></li>
                </ul>
                </div>
            </div>

                {/* Redes Sociais e Copyright */}
                <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-6">
                    {socialLinks.map((item, index) => (
                    <a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#00A3FF] transition-colors"
                    >
                        {item.icon}
                    </a>
                    ))}
                </div>
                <p className="text-gray-500 text-sm">
                    Copyright © 2025, Spacefy. All rights reserved.
                </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;