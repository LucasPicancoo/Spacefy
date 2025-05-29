import { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { useUser } from '../Contexts/UserContext';
import { toast } from 'react-toastify';

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            loadFavorites(user.id);
        } else {
            setFavorites([]);
        }
    }, [user]);

    const toggleFavorite = async (userId, spaceId) => {
        try {
            setLoading(true);
            const response = await userService.toggleFavoriteSpace(userId, spaceId);
            const isFavorite = response.isFavorited;
            
            if (isFavorite) {
                toast.success('Espaço adicionado aos favoritos!');
                setFavorites(prev => [...prev, spaceId]);
            } else {
                toast.error('Espaço removido dos favoritos');
                setFavorites(prev => prev.filter(id => id !== spaceId));
            }
            
            return isFavorite;
        } catch (error) {
            console.error('Erro ao favoritar espaço:', error);
            toast.error('Erro ao atualizar favoritos');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const isFavorite = (spaceId) => {
        return favorites.includes(spaceId);
    };

    const loadFavorites = async (userId) => {
        try {
            setLoading(true);
            const response = await userService.getFavoriteSpaces(userId);
            setFavorites(response.map(favorite => favorite.spaceId._id));
        } catch (error) {
            console.error('Erro ao carregar favoritos:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FavoriteContext.Provider value={{ favorites, loading, toggleFavorite, isFavorite, loadFavorites }}>
            {children}
        </FavoriteContext.Provider>
    );
}

export function useFavorite() {
    const context = useContext(FavoriteContext);
    if (!context) {
        throw new Error('useFavorite deve ser usado dentro de um FavoriteProvider');
    }
    return context;
} 