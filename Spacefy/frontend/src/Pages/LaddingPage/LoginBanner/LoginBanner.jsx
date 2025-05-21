import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';

const LoginBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="py-7">
      <div className="container mx-auto px-4 max-w-7xl mt-10">
        <div className="bg-gradient-to-r from-[#105B99] to-[#083A63] rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-white">
              <FaEnvelope className="text-3xl" />
            </div>
            <p className="text-white text-lg">
              Faça login e receba ofertas exclusivas, descontos e novidades sobre os melhores espaços!
            </p>
          </div>
          <button 
            onClick={() => navigate("/Login")} 
            className="bg-[#00A3FF] text-white px-6 py-2 rounded-lg hover:bg-[#0084CC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] focus:ring-opacity-50"
          >
            Fazer Login
          </button>
        </div>
      </div>
    </section>
  );
};

export default LoginBanner; 