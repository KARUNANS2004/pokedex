import { useEffect, useState } from "react"
import { getFullPokedexNumber, getPokedexNumber } from "../utils"
import TypeCard from './Typecard'
import Modal from "./Modal"

export function Pokecard(props){
    const { selectedPokemon }=props
    const [data,setData]= useState(null)
    const [loading,setLoading]=useState(false)
    const [skill, setSkill]=useState(null)
    const [loadingSkill, setLoadingSkill] = useState(false)

    const {name,height,abilities, stats, types, moves, sprites}=data || {}

    const imgList=Object.keys(sprites || {}).filter((val)=>{
        if(!sprites[val]){return false}
        if(['versions','other'].includes(val)){return false}
        return true;
    })

    // Other way of fetching data without using the useEffect

    async function fetchMoveData(move,moveUrl) {
        if(loadingSkill || !localStorage || !moveUrl){
            return ;
        }
        // caching
        let cacheMove={};
        if(localStorage.getItem('pokemon-moves')){
            cacheMove=JSON.parse(localStorage.getItem('pokemon-moves'))
        }

        if(move in cacheMove){
            setSkill(cacheMove[move])
            console.log('found move in cache')
            return 
        }

        // if not found in the cache
        try {
            setLoadingSkill(true)
            const res =await fetch(moveUrl)
            const moveData=await res.json()
            console.log('fetched move from API',moveData)
            const description=moveData?.flavor_text_entries.filter(val=>{
                return val.version_group.name=='firered-leafgreen'
            })[0]?.flavor_text

            const skillData={
                name:move,
                description:description,
            }
            setSkill(skillData)

            //  caching this
            cacheMove[move]= skillData
            localStorage.setItem('pokemon-moves',JSON.stringify(cacheMove))

        } catch (error) {
            console.log(error)
        }finally{
            setLoadingSkill(false)
        }
    }

    useEffect(()=>{
        // if loading then exit logic
        if(loading || !localStorage){
            return;
        }
        // check if the selected pokemon information is available in the cache
        // 1. define the cache
        let cache={}
        if(localStorage.getItem('pokedex')){
            cache=JSON.parse(localStorage.getItem('pokedex'))
        }
        //2. check if the selected pokemon is in the cache, otherwise fetch from the API
        if(selectedPokemon in cache){
            // read from cache
            setData(cache[selectedPokemon])
            console.log('Found pokemon in cache')
            return;
        }
        // we passed all the cache stuff to no avail and now need to fetch the data from the API

        async function fetchPokemonData() {
            setLoading(true)
            try {
                const baseURL='https://pokeapi.co/api/v2/'
                const suffix='pokemon/'+ getPokedexNumber(selectedPokemon);
                const finalUrl=baseURL+ suffix;
                const res=await fetch(finalUrl);
                if (!res.ok) { 
                    throw new Error('Network response was not ok');
                }
                const pokemonData=await res.json()
                setData(pokemonData)
                console.log('Fetched pokemon data')
                cache[selectedPokemon]=pokemonData
                localStorage.setItem('pokedex',JSON.stringify(cache))
            } catch (error) {
                console.log(error.message)
            }finally{
                setLoading(false)
            }
        }

        fetchPokemonData()

        // if we fetch from the API make sure to save that information to the cache
    },[selectedPokemon])

    if(loading || !data){
        return(
            <div>
                <h4>Loading...</h4>
            </div>
        )
    }

    return(
        <div className="poke-card">
            {/* Conditional Rendering */}
            {skill && (
                <Modal handleCloseModal={()=>{setSkill(null)}}>
                <div>
                    <h6 className="skill-name">Name</h6>
                    <h2>{skill.name.replaceAll('-',' ')}</h2>
                </div>
                <div>
                    <h6>Description</h6>
                    <p>{skill.description}</p>
                </div>
            </Modal>
            )}

            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2>{name}</h2>
            </div>
            <div className="type-container">
                {types.map((typeObj,typeIndex)=>{
                    return(
                        <TypeCard key={typeIndex} type={typeObj?.type?.name}/>
                    )
                })}
            </div>
            <img src={'./pokemon/'+getFullPokedexNumber(selectedPokemon)+'.png'} alt={`${name}-large-img`} className="default-img" />
            <div className="img-container">
                {
                    imgList.map((spriteUrl,spriteIndex)=>{
                        const imgUrl=sprites[spriteUrl]
                        return(
                            <img src={imgUrl} key={spriteIndex} alt={`${name}-img-${spriteUrl}`} />
                        )
                    })
                }
            </div>
            <h3>Stats</h3>
            <div className="stats-card">
                {
                    stats.map((statObj,statIndex)=>{
                        const {stat, base_stat}=statObj
                        return(
                            <div className="stat-item" key={statIndex}>
                                <p>{stat?.name.replaceAll('-',' ')}</p>
                                <h4>{base_stat}</h4>
                            </div>
                        )
                    })
                }
            </div>
            <h3>Moves</h3>
            <div className="pokemon-move-grid">
                {
                    moves.map((moveObj,moveIndex)=>{
                        return(
                            <button className="button-card pokemon-move" key={moveIndex} onClick={()=>{fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)}}>
                                <p>{moveObj?.move?.name.replaceAll('-',' ')}</p>
                            </button>
                        )
                    })
                }
            </div>
        </div>
    )
}