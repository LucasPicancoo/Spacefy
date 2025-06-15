import { useFavorite } from '../../Contexts/FavoriteContext';
import { useUser } from '../../Contexts/UserContext';

export function FavoriteButton({ spaceId, className = '' }) {
    const { toggleFavorite, isFavorite, loading } = useFavorite();
    const { user } = useUser();

    const handleFavoriteClick = async (e) => {
        e.stopPropagation(); // Previne que o clique propague para elementos pai
        if (!user) {
            // Aqui você pode adicionar uma lógica para redirecionar para o login
            return;
        }
        try {
            await toggleFavorite(user.id, spaceId);
        } catch (error) {
            console.error('Erro ao favoritar:', error);
        }
    };

    const isFavorited = isFavorite(spaceId);
    const buttonLabel = isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos';

    return (
        <button 
            className={`text-[#1486B8] hover:text-[#0f6a94] transition-colors ${className}`}
            onClick={handleFavoriteClick}
            disabled={loading}
            aria-label={buttonLabel}
            aria-pressed={isFavorited}
            aria-busy={loading}
            role="button"
        >
            <svg 
                xmlns='http://www.w3.org/2000/svg' 
                fill={isFavorited ? 'currentColor' : 'none'} 
                viewBox='0 0 24 24' 
                strokeWidth={2} 
                stroke='currentColor' 
                className='w-6 h-6'
                aria-hidden="true"
                role="img"
            >
                <path 
                    strokeLinecap='round' 
                    strokeLinejoin='round' 
                    d='M16.5 5.25a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 5.25C5.014 5.25 3 7.264 3 9.75c0 4.418 7.5 9 7.5 9s7.5-4.582 7.5-9c0-2.486-2.014-4.5-4.5-4.5z' 
                />
            </svg>
            <span className="sr-only">
                {isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            </span>
        </button>
    );
} 