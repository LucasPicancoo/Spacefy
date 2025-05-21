import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const FAQSection = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    if (openQuestion === index) {
      setOpenQuestion(null);
    } else {
      setOpenQuestion(index);
    }
  };

  const faqQuestions = [
    {
      question: "Como faço para reservar um espaço?",
      answer: "Para reservar um espaço, basta selecionar o local desejado, escolher a data e horário disponíveis e efetuar o pagamento. Todo o processo é feito de forma simples e rápida através da nossa plataforma."
    },
    {
      question: "Quais tipos de espaços estão disponíveis?",
      answer: "Oferecemos uma ampla variedade de espaços, incluindo salões de festa, quadras esportivas, salas de reunião, espaços para eventos e muito mais. Cada espaço é cuidadosamente selecionado para atender diferentes necessidades."
    },
    {
      question: "Os espaços podem ser alugados por hora ou apenas por diária?",
      answer: "Sim, oferecemos flexibilidade na locação. Dependendo do espaço, você pode alugar tanto por hora quanto por diária, permitindo que você escolha a opção que melhor atende suas necessidades."
    },
    {
      question: "Posso cancelar uma reserva?",
      answer: "Sim, você pode cancelar uma reserva. As políticas de cancelamento podem variar de acordo com o espaço e a antecedência do cancelamento. Recomendamos verificar as políticas específicas no momento da reserva."
    },
    {
      question: "Como posso entrar em contato para tirar dúvidas?",
      answer: "Você pode entrar em contato conosco através do nosso chat online, email de suporte ou telefone. Nossa equipe está disponível para ajudar com qualquer dúvida ou necessidade."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Tem Perguntas?</h2>
          <p className="text-2xl font-bold">Nós Temos as Respostas!</p>
        </div>

        <div className="space-y-4">
          {faqQuestions.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50"
              >
                <span className="font-medium text-lg">{faq.question}</span>
                <FaChevronDown 
                  className={`text-gray-400 transition-transform duration-200 ${
                    openQuestion === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openQuestion === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection; 