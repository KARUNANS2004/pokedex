import { useState } from 'react'
import {first151Pokemon,getFullPokedexNumber, getPokedexNumber} from '../utils'

export default function SideNav(props){
    const {selectedPokemon, setSelectedPokemon,handleToggleMenu,showSideMenu,handleCloseMenu}=props

    const [searchValue, setSearchValue]=useState('')

    const filteredPokemon=first151Pokemon.filter((ele,eleIndex)=>{
        // if full pokedex number includes the current search value then return true
        if(getFullPokedexNumber(eleIndex).includes(searchValue)){
            return true;
        }
        // if the pokemon name includes the current search value then return true
        if(ele.toLowerCase().includes(searchValue.toLowerCase())){
            return true;
        }
        // otherwise return false
        return false
    })
    return (
        <nav className={' ' + (!showSideMenu?' open':'')}>
            <div className={'header' + (!showSideMenu? ' open': '')}>
                <button onClick={handleToggleMenu} className='open-nav-button'>
                    <i className="fa-solid fa-arrow-left-long"></i>
                </button>
                <h1 className='text-gradient'>Pokedéx</h1>
            </div>
            <input placeholder='E.g. 001 or Bulbasaur' value={searchValue} onChange={(e)=>{
                setSearchValue(e.target.value)
            }} />
            {filteredPokemon.map((pokemon,pokemonIndex)=>{
                return(
                    <button onClick={()=>{
                        setSelectedPokemon(first151Pokemon.indexOf(pokemon))
                        handleCloseMenu()
                        // we are using this type of format to get the pokemon index because when we filter our sdeNav list the index gets change so to avoid any error we are using this way and you could also make a variable to assign this pokemon index.
                    }} key={pokemonIndex} className={'nav-card' + (pokemonIndex===selectedPokemon?'nav-card-selected':'')}>
                        <p>{getFullPokedexNumber(first151Pokemon.indexOf(pokemon))}</p>
                        <p>{pokemon}</p>
                    </button>
                )
            })}
        </nav>
    )
}