import React from 'react'

import Navigation from './elements/Navigation'
import MovieInfo from './elements/MovieInfo'
import MovieInfoBar from './elements/MovieInfoBar'
import Actor from './elements/Actor'
import Grid from './elements/Grid'
import Spinner from './elements/Spinner'

import {useMovieFetch} from './hooks/useMovieFetch'

const Movie = ({ movieId }) => {
    const [movieInfo, loading, error] = useMovieFetch(movieId)

    if (error) return <div> Something wrong happened... </div>
    if (loading) return <Spinner />

    return (
    <>
        <Navigation movieTitle={movieInfo.original_title} />
        <MovieInfo movieInfo={movieInfo} />
        <MovieInfoBar
            time={movieInfo.runtime}
            budget={movieInfo.budget}
            revenue={movieInfo.revenue}
        />
        <Grid header='Actors'>
            {movieInfo.actors.map(actor => (
                <Actor key={actor.credit_id} actor={actor}/>
            ))}
        </Grid>
        {loading && <Spinner/>}
        
    </>


)
}

export default Movie