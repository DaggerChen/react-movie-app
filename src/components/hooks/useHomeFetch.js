import {useState, useEffect} from 'react'
import {POPULAR_BASE} from '../../config'

export const useHomeFetch = searchTerm => {
    const [state, setState] = useState({ movies: [] })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    
    const fetchMovies = async endpoint => {
        setError(false)
        setLoading(true)

        const isLoadMore = endpoint.search('page');
        try {
            const result = await (await fetch(endpoint)).json();
            setState(prev => ({
                ...prev,
                movies: 
                    // If it is load more, we merge the existing movies with newly found movies
                    // Otherwise, we refresh the movies page
                    isLoadMore !== -1 
                    ? [...prev.movies, ...result.results]
                    : [...result.results],
                heroImage: prev.heroImage || result.results[0],
                currentPage: result.page,
                totalPages: result.total_pages,
            }))
            
        } catch (error) {
            setError(true)
            console.log(error)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (sessionStorage.homeState) {
            setState(JSON.parse(sessionStorage.homeState))
            setLoading(false)
        } else {
            fetchMovies(`${POPULAR_BASE}`);
        }
    }, []) // Make sure it only runs once

    useEffect(() => {
        if (!searchTerm) {
            sessionStorage.setItem('homeState', JSON.stringify(state))
        }
    }, [searchTerm, state])

    return [{ state, loading, error}, fetchMovies]
}
