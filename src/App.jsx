import { useState } from 'react'
import Header from './components/Header'
import SideNav from './components/SideNav'
import {Pokecard} from './components/Pokecard'

// export statement with default keyword can be imported without the curly braces and the export statements without default keyboard then we should impor them using curly braces 


function App() {
  const [selectedPokemon, setSelectedPokemon]=useState(0);
  const [showSideMenu, setShowSideMenu]= useState(true)// sorry but this does the opposite of what it should do

  function handleToggleMenu(){
    setShowSideMenu(!showSideMenu)
  }

  function handleCloseMenu(){
    setShowSideMenu(true)
  }


  return (
    <>
    <Header handleToggleMenu={handleToggleMenu}  />
    <SideNav 
      showSideMenu={showSideMenu}
      selectedPokemon={selectedPokemon} 
      setSelectedPokemon={setSelectedPokemon} 
      handleToggleMenu={handleToggleMenu}
      handleCloseMenu={handleCloseMenu}
    />
    <Pokecard selectedPokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon} />
    </>
  )
}

export default App