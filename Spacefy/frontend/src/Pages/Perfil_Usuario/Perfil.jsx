import React, { useState, useRef, useEffect, useCallback } from "react";
import Header from "../../Components/Header/Header";
import { FaHeart, FaStar, FaClock, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useUser } from "../../Contexts/UserContext";
import { useFavorite } from "../../Contexts/FavoriteContext";
import { useNavigate } from "react-router-dom";
import BecomeRenterModal from "../../Components/Modal/BecomeRenterModal";
import { userService } from "../../services/userService";
import { rentalService } from "../../services/rentalService";
import { assessmentService } from "../../services/assessmentService";
import SpaceCard from "../../Components/SpaceCard/SpaceCard";

const Perfil = () => {
  const [receivedAssessments, setReceivedAssessments] = useState([]);
  const [receivedAssessmentPagination, setReceivedAssessmentPagination] =
    useState({
      currentPage: 1,
      totalPages: 1,
      totalAssessments: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  const [currentPage, setCurrentPage] = useState(0);
  const [ratedPage, setRatedPage] = useState(0);
  const [rentedPage, setRentedPage] = useState(0);
  const [favoriteSpaces, setFavoriteSpaces] = useState([]);
  const [viewHistory, setViewHistory] = useState([]);
  const [userRentals, setUserRentals] = useState([]);
  const [userAssessments, setUserAssessments] = useState([]);
  const [assessmentPagination, setAssessmentPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalAssessments: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [isBecomeRenterModalOpen, setIsBecomeRenterModalOpen] = useState(false);
  const recentCarouselRef = useRef(null);
  const ratedCarouselRef = useRef(null);
  const rentedCarouselRef = useRef(null);

  const navigate = useNavigate();
  const { user, isLoggedIn } = useUser();
  const { loadFavorites, toggleFavorite } = useFavorite();

  const fetchUserAssessments = useCallback(
    async (page = 1) => {
      try {
        const response = await assessmentService.getAssessmentsByUser(
          user.id,
          page
        );
        if (response && response.assessments) {
          setUserAssessments(response.assessments);
          setAssessmentPagination(response.pagination);
        }
      } catch (error) {
        console.error("Erro ao buscar avaliações do usuário:", error);
        setUserAssessments([]);
        setAssessmentPagination({
          currentPage: 1,
          totalPages: 1,
          totalAssessments: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        });
      }
    },
    [user?.id]
  );

  const handlePageChange = useCallback(
    async (newPage) => {
      if (newPage >= 1 && newPage <= assessmentPagination.totalPages) {
        await fetchUserAssessments(newPage);
      }
    },
    [fetchUserAssessments, assessmentPagination.totalPages]
  );

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/NotFound");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await userService.getFavoriteSpaces(user.id);
        setFavoriteSpaces(response);
        await loadFavorites(user.id);
      } catch (error) {
        console.error("Erro ao buscar favoritos:", error);
      }
    };

    const fetchViewHistory = async () => {
      try {
        const response = await userService.getViewHistory(user.id);
        setViewHistory(response.data || []);
      } catch (error) {
        console.error("Erro ao buscar histórico de visualizações:", error);
      }
    };

    const fetchUserRentals = async () => {
      try {
        const response = await rentalService.getRentalsByUserID(user.id);
        setUserRentals(response || []);
      } catch (error) {
        console.error("Erro ao buscar aluguéis do usuário:", error);
        setUserRentals([]);
      }
    };

    if (user?.id) {
      fetchFavorites();
      fetchViewHistory();
      fetchUserRentals();
    }
  }, [user?.id, loadFavorites]);

  // Efeito separado para carregar as avaliações iniciais
  useEffect(() => {
    if (user?.id) {
      fetchUserAssessments(1);
    }
  }, [user?.id]);

  // Novo para avaliações recebidas
  useEffect(() => {
    if (user?.id) {
      fetchReceivedAssessments(1);
    }
  }, [user?.id]);

  if (!isLoggedIn) {
    return null;
  }

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ("" + phoneNumber).replace(/\D/g, "");
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
        7
      )}`;
    }
    return phoneNumber;
  };

  const scrollRecentCarousel = (direction) => {
    if (recentCarouselRef.current) {
      const newPage = direction === "next" ? currentPage + 1 : currentPage - 1;
      const totalCards = mockCards.length;
      const cardsPerPage = Math.floor(
        recentCarouselRef.current.clientWidth / 250
      );
      const maxPages = Math.ceil(totalCards / cardsPerPage);

      if (newPage >= 0 && newPage < maxPages) {
        const scrollAmount = recentCarouselRef.current.clientWidth;
        recentCarouselRef.current.scrollTo({
          left: scrollAmount * newPage,
          behavior: "smooth",
        });
        setCurrentPage(newPage);
      }
    }
  };

  const scrollRatedCarousel = (direction) => {
    if (ratedCarouselRef.current) {
      const newPage = direction === "next" ? ratedPage + 1 : ratedPage - 1;
      const totalCards = mockCards.length;
      const cardsPerPage = Math.floor(
        ratedCarouselRef.current.clientWidth / 250
      );
      const maxPages = Math.ceil(totalCards / cardsPerPage);

      if (newPage >= 0 && newPage < maxPages) {
        const scrollAmount = ratedCarouselRef.current.clientWidth;
        ratedCarouselRef.current.scrollTo({
          left: scrollAmount * newPage,
          behavior: "smooth",
        });
        setRatedPage(newPage);
      }
    }
  };

  const scrollRentedCarousel = (direction) => {
    if (rentedCarouselRef.current) {
      const newPage = direction === "next" ? rentedPage + 1 : rentedPage - 1;
      const totalCards = mockCards.length;
      const cardsPerPage = Math.floor(
        rentedCarouselRef.current.clientWidth / 250
      );
      const maxPages = Math.ceil(totalCards / cardsPerPage);

      if (newPage >= 0 && newPage < maxPages) {
        const scrollAmount = rentedCarouselRef.current.clientWidth;
        rentedCarouselRef.current.scrollTo({
          left: scrollAmount * newPage,
          behavior: "smooth",
        });
        setRentedPage(newPage);
      }
    }
  };

  const handleFavorite = async (spaceId) => {
    try {
      await toggleFavorite(user.id, spaceId);
      // Atualiza a lista de favoritos após a mudança
      const updatedFavorites = await userService.getFavoriteSpaces(user.id);
      setFavoriteSpaces(updatedFavorites);
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
    }
  };

  const fetchReceivedAssessments = useCallback(
    async (page = 1) => {
      try {
        const response = await assessmentService.getAssessmentsByUser(
          user.id,
          page
        );
        if (response && response.assessments) {
          setReceivedAssessments(response.assessments);
          setReceivedAssessmentPagination(response.pagination);
        }
      } catch (error) {
        console.error("Erro ao buscar avaliações recebidas:", error);
        setReceivedAssessments([]);
        setReceivedAssessmentPagination({
          currentPage: 1,
          totalPages: 1,
          totalAssessments: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        });
      }
    },
    [user?.id]
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 w-full mx-auto py-8 overflow-hidden">
        <section className="flex gap-8 mb-8 px-4">
          {/* Card do Usuário */}
          <aside className="w-70 self-start sticky top-4">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                  <img
                    src={user?.profilePhoto}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    {user?.name} {user?.surname}
                  </h2>
                  <p className="text-gray-600 text-sm">{user?.role}</p>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/EditarPerfilUsuario")}
                  className="w-full bg-[#00A3FF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0084CC] transition-colors cursor-pointer"
                >
                  Editar Perfil
                </button>
                {user?.role !== "locatario" && (
                  <button
                    onClick={() => setIsBecomeRenterModalOpen(true)}
                    className="w-full bg-white border-2 border-[#00A3FF] text-[#00A3FF] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00A3FF] hover:text-white transition-colors cursor-pointer"
                  >
                    Virar Locador
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Sobre o usuário</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-sm">
                    {user?.name} {user?.surname}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm">
                    {user?.email || "Não informado"}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-sm">
                    {formatPhoneNumber(user?.telephone) || "Não informado"}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Conteúdo principal */}
          <section className="flex-1 flex flex-col gap-8 overflow-hidden">
            {/* Avaliações recebidas */}
            <section>
              <h2 className="font-bold text-lg mb-2 px-4">
                Avaliações recebidas:
              </h2>
              {receivedAssessments && receivedAssessments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
                  {receivedAssessments.map((assessment) => (
                    <div
                      key={assessment._id}
                      className="bg-white rounded-lg shadow-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span className="font-semibold">
                            {assessment.score}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(
                            assessment.evaluation_date
                          ).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{assessment.comment}</p>
                      <p className="text-gray-500 text-xs">
                        Avaliado por: <b>{assessment.createdBy?.name}</b> (
                        {assessment.createdBy?.role})
                      </p>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() =>
                            navigate(`/espaco/${assessment.spaceID}`)
                          }
                          className="text-[#00A3FF] hover:text-[#0084CC] text-sm font-medium"
                        >
                          Ver espaço
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm px-4">
                  Você ainda não recebeu nenhuma avaliação.
                </div>
              )}
            </section>
            {/* Vistos recentemente */}
            <section className="overflow-hidden">
              <h2 className="font-bold text-lg mb-2 px-4">
                Vistos recentemente:
              </h2>
              <div className="relative">
                <div
                  ref={recentCarouselRef}
                  className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar scroll-smooth px-4"
                  style={{
                    scrollSnapType: "x mandatory",
                    scrollPadding: "0 16px",
                  }}
                >
                  {viewHistory.length > 0 ? (
                    viewHistory
                      .map((view) => {
                        if (!view.space_id) return null;
                        return (
                          <SpaceCard
                            key={view._id}
                            space={{
                              _id: view.space_id._id,
                              space_name: view.space_id.space_name,
                              location: view.space_id.location,
                              price_per_hour: view.space_id.price_per_hour,
                              image_url: view.space_id.image_url,
                            }}
                            className="min-w-[300px] flex-shrink-0"
                          />
                        );
                      })
                      .filter(Boolean)
                  ) : (
                    <div className="text-gray-500 text-sm px-4">
                      Nenhum espaço visualizado recentemente.
                    </div>
                  )}
                </div>
                {/* Botões de navegação */}
                {currentPage > 0 && viewHistory.length > 0 && (
                  <button
                    onClick={() => scrollRecentCarousel("prev")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 ml-2 bg-white p-2 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
                  >
                    <FaChevronLeft className="text-lg" />
                  </button>
                )}
                {currentPage <
                  Math.ceil(
                    viewHistory.length /
                      Math.floor(
                        recentCarouselRef.current?.clientWidth / 250 || 1
                      )
                  ) -
                    1 &&
                  viewHistory.length > 0 && (
                    <button
                      onClick={() => scrollRecentCarousel("next")}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 mr-2 bg-white p-2 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
                    >
                      <FaChevronRight className="text-lg" />
                    </button>
                  )}
              </div>
            </section>

            {/* Favoritos */}
            <section className="overflow-hidden">
              <h2 className="font-bold text-lg mb-2 px-4">Favoritos:</h2>
              <div className="relative">
                <div
                  ref={ratedCarouselRef}
                  className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar scroll-smooth px-4"
                  style={{
                    scrollSnapType: "x mandatory",
                    scrollPadding: "0 16px",
                  }}
                >
                  {favoriteSpaces && favoriteSpaces.length > 0 ? (
                    favoriteSpaces.map((favorite) => (
                      <SpaceCard
                        key={favorite.spaceId._id}
                        space={favorite.spaceId}
                        className="min-w-[300px] flex-shrink-0"
                      />
                    ))
                  ) : (
                    <div className="w-full text-center py-8 px-4">
                      <div className="flex flex-col items-center gap-4">
                        <FaHeart className="text-gray-300 text-4xl" />
                        <p className="text-gray-500">
                          Você ainda não tem espaços favoritos
                        </p>
                        <button
                          onClick={() => navigate("/Descobrir")}
                          className="text-[#00A3FF] hover:text-[#0084CC] font-medium cursor-pointer"
                        >
                          Explorar espaços
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {/* Botões de navegação */}
                {ratedPage > 0 &&
                  favoriteSpaces &&
                  favoriteSpaces.length > 0 && (
                    <button
                      onClick={() => scrollRatedCarousel("prev")}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 ml-2 bg-white p-2 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
                    >
                      <FaChevronLeft className="text-lg" />
                    </button>
                  )}
                {ratedPage <
                  Math.ceil(
                    (favoriteSpaces?.length || 0) /
                      Math.floor(
                        ratedCarouselRef.current?.clientWidth / 250 || 1
                      )
                  ) -
                    1 &&
                  favoriteSpaces &&
                  favoriteSpaces.length > 0 && (
                    <button
                      onClick={() => scrollRatedCarousel("next")}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 mr-2 bg-white p-2 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
                    >
                      <FaChevronRight className="text-lg" />
                    </button>
                  )}
              </div>
            </section>

            {/* Alugados por você */}
            <section className="overflow-hidden">
              <h2 className="font-bold text-lg mb-2 px-4">
                Alugados por você:
              </h2>
              <div className="relative">
                <div
                  ref={rentedCarouselRef}
                  className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar scroll-smooth px-4"
                  style={{
                    scrollSnapType: "x mandatory",
                    scrollPadding: "0 16px",
                  }}
                >
                  {userRentals && userRentals.length > 0 ? (
                    Array.from(
                      new Set(userRentals.map((rental) => rental.space?._id))
                    )
                      .map((spaceId) => {
                        const rental = userRentals.find(
                          (r) => r.space?._id === spaceId
                        );
                        if (!rental?.space) return null;
                        return (
                          <SpaceCard
                            key={rental._id}
                            space={{
                              _id: rental.space._id,
                              space_name: rental.space.space_name,
                              location: rental.space.location,
                              price_per_hour: rental.space.price_per_hour,
                              image_url: rental.space.image_url,
                              rating: rental.space.nota || 4.8,
                              totalReviews: rental.space.avaliacoes || 0,
                            }}
                            className="min-w-[300px] flex-shrink-0"
                          />
                        );
                      })
                      .filter(Boolean)
                  ) : (
                    <div className="text-gray-500 text-sm px-4">
                      Você ainda não alugou nenhum espaço.
                    </div>
                  )}
                </div>
                {/* Botões de navegação */}
                {rentedPage > 0 && userRentals && userRentals.length > 0 && (
                  <button
                    onClick={() => scrollRentedCarousel("prev")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 ml-2 bg-white p-2 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
                  >
                    <FaChevronLeft className="text-lg" />
                  </button>
                )}
                {rentedPage <
                  Math.ceil(
                    (userRentals?.length || 0) /
                      Math.floor(
                        rentedCarouselRef.current?.clientWidth / 250 || 1
                      )
                  ) -
                    1 &&
                  userRentals &&
                  userRentals.length > 0 && (
                    <button
                      onClick={() => scrollRentedCarousel("next")}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 mr-2 bg-white p-2 rounded-full shadow-lg text-gray-600 hover:text-[#00A3FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] z-10"
                    >
                      <FaChevronRight className="text-lg" />
                    </button>
                  )}
              </div>
            </section>

            {/* Avaliações feitas por você */}
            <section>
              <h2 className="font-bold text-lg mb-2 px-4">
                Avaliações feitas por você:
              </h2>
              {userAssessments && userAssessments.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
                    {userAssessments.map((assessment) => (
                      <div
                        key={assessment._id}
                        className="bg-white rounded-lg shadow-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span className="font-semibold">
                              {assessment.score}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(
                              assessment.evaluation_date
                            ).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">
                          {assessment.comment}
                        </p>
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() =>
                              navigate(`/espaco/${assessment.spaceID}`)
                            }
                            className="text-[#00A3FF] hover:text-[#0084CC] text-sm font-medium"
                          >
                            Ver espaço
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Paginação */}
                  <div className="flex justify-center items-center gap-4 mt-6 px-4">
                    <button
                      onClick={() =>
                        handlePageChange(assessmentPagination.currentPage - 1)
                      }
                      disabled={!assessmentPagination.hasPreviousPage}
                      className={`px-4 py-2 rounded-lg ${
                        assessmentPagination.hasPreviousPage
                          ? "bg-[#00A3FF] text-white hover:bg-[#0084CC]"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Anterior
                    </button>
                    <span className="text-gray-600">
                      Página {assessmentPagination.currentPage} de{" "}
                      {assessmentPagination.totalPages}
                    </span>
                    <button
                      onClick={() =>
                        handlePageChange(assessmentPagination.currentPage + 1)
                      }
                      disabled={!assessmentPagination.hasNextPage}
                      className={`px-4 py-2 rounded-lg ${
                        assessmentPagination.hasNextPage
                          ? "bg-[#00A3FF] text-white hover:bg-[#0084CC]"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Próxima
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 text-sm px-4">
                  Você ainda não fez nenhuma avaliação.
                </div>
              )}
            </section>
          </section>
        </section>
      </main>
      <BecomeRenterModal
        isOpen={isBecomeRenterModalOpen}
        onClose={() => setIsBecomeRenterModalOpen(false)}
      />
    </div>
  );
};

export default Perfil;
