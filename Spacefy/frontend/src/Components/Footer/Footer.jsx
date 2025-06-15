import Logo from "../../assets/Logo.svg";
import { FaFacebookF, FaPinterestP, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";


function Footer() {

    // Lista de redes sociais
    const socialLinks = [
        { icon: <FaFacebookF className="text-xl" />, link: "https://www.facebook.com/", label: "Facebook" },
        { icon: <FaPinterestP className="text-xl" />, link: "https://www.pinterest.com/", label: "Pinterest" },
        { icon: <FaTwitter className="text-xl" />, link: "https://www.twitter.com/", label: "Twitter" },
        { icon: <FaYoutube className="text-xl" />, link: "https://www.youtube.com/", label: "YouTube" },
        { icon: <FaInstagram className="text-xl" />, link: "https://www.instagram.com/", label: "Instagram" },
  ];

      
    return (
    <footer 
        className="border-t border-gray-200 py-12"
        role="contentinfo"
        aria-label="Rodapé do site"
    >
            <div className="container mx-auto px-4">
            {/* Logo e Linha Superior */}
            <div 
                className="border-t border-[#00A3FF] pt-8 mt-8 mb-8 flex items-center gap-4"
                role="banner"
                aria-label="Logo e nome da empresa"
            >
                <img src={Logo} alt="Logo Spacefy" className="h-12" />
                <span 
                    className="text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-[#1EACE3] to-[#152F6C] bg-clip-text text-transparent tracking-widest"
                    aria-label="Spacefy"
                >
                SPACEFY
                </span>
            </div>

                {/* Grid de Links */}
                <div 
                    className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8 border-b border-[#00A3FF] pb-8"
                    role="navigation"
                    aria-label="Links do rodapé"
                >
                {/* Spacefy */}
                <div role="region" aria-labelledby="spacefy-heading">
                <h3 id="spacefy-heading" className="font-bold mb-4">Spacefy</h3>
                <ul className="space-y-2" role="list">
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]" aria-label="Saiba mais sobre a Spacefy">Quem somos</a></li>
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]" aria-label="Acessar página de cadastro ou login">Cadastro/Login</a></li>
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]" aria-label="Ver oportunidades de trabalho">Trabalhe conosco</a></li>
                </ul>
                </div>

                {/* Hospedagem */}
                <div role="region" aria-labelledby="hospedagem-heading">
                <h3 id="hospedagem-heading" className="font-bold mb-4">Hospedagem</h3>
                <ul className="space-y-2" role="list">
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]" aria-label="Ver espaços mais bem avaliados">Mais bem avaliados</a></li>
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]" aria-label="Ver quadras poliesportivas">Quadras poliesportivas</a></li>
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]" aria-label="Ver locais para festas">Locais para festas</a></li>
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]" aria-label="Ver casas de show">Casas de show</a></li>
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]" aria-label="Anunciar seu espaço">Anuncie seu espaço</a></li>
                </ul>
                </div>

                {/* Central de Atendimento */}
                <div role="region" aria-labelledby="atendimento-heading">
                <h3 id="atendimento-heading" className="font-bold mb-4">Central de Atendimento</h3>
                <ul className="space-y-2" role="list">
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]" aria-label="Acessar central de ajuda">Central de Ajuda</a></li>
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]" aria-label="Entrar em contato">Contate-nos</a></li>
                    <li><span className="text-gray-600" aria-label="Telefone de atendimento">(00) 0000 - 0000</span></li>
                    <li><span className="text-gray-600" aria-label="Horário de atendimento de segunda a sexta">Segunda a Sexta: 08h às 18h</span></li>
                    <li><span className="text-gray-600" aria-label="Horário de atendimento aos sábados e feriados">Sábados e Feriados Nacionais: 09h às 16h</span></li>
                </ul>
                </div>

                {/* Termos */}
                <div role="region" aria-labelledby="termos-heading">
                <h3 id="termos-heading" className="font-bold mb-4">Termos</h3>
                <ul className="space-y-2" role="list">
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]" aria-label="Ler termos de uso do site">Termos de uso do site</a></li>
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]" aria-label="Ler política de privacidade">Política de privacidade</a></li>
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]" aria-label="Ler política de cancelamento e reembolso">Política de Cancelamento e Reembolso</a></li>
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]" aria-label="Ler política de pagamento">Política de Pagamento</a></li>
                </ul>
                </div>

                {/* App */}
                <div role="region" aria-labelledby="app-heading">
                <h3 id="app-heading" className="font-bold mb-4">App</h3>
                <ul className="space-y-2" role="list">
                    <li><a href="/" className="text-gray-600 hover:text-[#00A3FF]" aria-label="Baixar aplicativo Spacefy">Baixe o nosso aplicativo</a></li>
                </ul>
                </div>
            </div>

                {/* Redes Sociais e Copyright */}
                <div 
                    className="flex flex-col items-center space-y-4"
                    role="contentinfo"
                    aria-label="Redes sociais e direitos autorais"
                >
                <div 
                    className="flex space-x-6"
                    role="navigation"
                    aria-label="Redes sociais"
                >
                    {socialLinks.map((item, index) => (
                    <a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#00A3FF] transition-colors"
                        aria-label={`Visitar nosso ${item.label}`}
                    >
                        {item.icon}
                    </a>
                    ))}
                </div>
                <p 
                    className="text-gray-500 text-sm"
                    role="contentinfo"
                    aria-label="Direitos autorais"
                >
                    Copyright © 2025, Spacefy. All rights reserved.
                </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;