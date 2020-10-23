import {useState, useEffect, useCallback} from 'react'
import { API_URL, API_KEY} from '../../config'

export const useMovieFetch = movieId => {
    const [state, setState] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const fetchData = useCallback(async () => {
        setError(false)
        setLoading(true)
        try {
            const movieEndpoint = `${API_URL}movie/${movieId}?api_key=${API_KEY}`
            const movieResult = await (await fetch(movieEndpoint)).json()
            const creditsEndpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`
            const creditsResult = await (await fetch(creditsEndpoint)).json();
            // Filtering directors
            const directors = creditsResult.crew.filter(
                member => member.job === 'Director'
            )
            setState({
                ...movieResult,
                actors: creditsResult.cast,
                directors
            })
        } catch (error) {
            setError(true)
        } 
        setLoading(false)
    }, [movieId])

    useEffect(() => {
        if (localStorage[movieId]) {
            setState(JSON.parse(localStorage[movieId]))
            setLoading(false)
        } else {
            fetchData()
        }

    }, [fetchData, movieId])

    useEffect(() => {
        localStorage.setItem(movieId, JSON.stringify(state))
    }, [movieId, state])

    return [state, loading, error]
}