// Modal is just a pop up overlay on the screen in react

// Here this pop-up will allow to use a skill or move and then get a breakdown of what that move actually is as an overlay

import { Children } from 'react'
import ReactDom from 'react-dom'

export default function Modal(props){
    const {children, handleCloseModal}=props
    return ReactDom.createPortal(
        <div className='modal-container'>
            <button onClick={handleCloseModal} className='modal-underlay' />
            <div className='modal-content'>
                {children}
            </div>
        </div>,
        document.getElementById('portal')
    )
}