import React, { useState } from 'react'
import {
    POSTER_SIZE,
    BACKDROP_SIZE,
    IMAGE_BASE_URL,
    SEARCH_BASE,
    POPULAR_BASE,
} from '../config'

// import all components
import HeroImage from './elements/HeroImage'
import LoadMoreBtn from './elements/LoadMoreBtn'
import MovieThumb from './elements/MovieThumb'
import SearchBar from './elements/SearchBar'
import Spinner from './elements/Spinner'
import Grid from './elements/Grid'

// Custom Hook
import {useHomeFetch} from './hooks/useHomeFetch'

import NoImage from './images/no_image.jpg'


const Home = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [
        { state : {movies, currentPage, totalPages, heroImage},
         loading,
         error},
         fetchMovies
        ] = useHomeFetch(searchTerm)

    const searchMovies = search => {
        const endpoint = search ? SEARCH_BASE + search : POPULAR_BASE
        setSearchTerm(search)
        fetchMovies(endpoint)
    }

    const loadMoreMovies = () => {
        const searchEndpoint = `${SEARCH_BASE}${searchTerm}&page=${currentPage + 1}`
        const popularEndpoint = `${POPULAR_BASE}&page=${currentPage + 1}`

        const endpoint = searchTerm ? searchEndpoint : popularEndpoint
        fetchMovies(endpoint)
    }

    if (error) return <div>Something wrong happend...</div>
    if (!movies[0] && !searchTerm) return <Spinner />
    return (
        <React.Fragment>
            {!searchTerm &&
            <HeroImage image= {`${IMAGE_BASE_URL}${BACKDROP_SIZE}${heroImage.backdrop_path}`}
            title={heroImage.original_title}
            text={heroImage.overview}
            />
            }
            <SearchBar callback={searchMovies}/>
            <Grid header={searchTerm ? 'Search Result' : 'Popular Movies'}>
                {movies.map(movie => (
                    <MovieThumb
                        key={movie.id}
                        clickable
                        image={
                            movie.poster_path 
                                ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
                                : NoImage
                        }
                        movieId={movie.id}
                        movieName={movie.original_title}
                        />
                ))
                }
                { !movies[0] && searchTerm && 
                    <h3> No Result Found </h3>
                }
            </Grid>
            { loading && <Spinner /> } 
            
            {currentPage < totalPages && !loading && 
                <LoadMoreBtn text='Load More' callback={loadMoreMovies}/>
            }
            
        </React.Fragment>
    )
}

export default Home