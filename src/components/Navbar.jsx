import React from 'react'
import { Link, NavLink, withRouter } from 'react-router-dom'
import {auth} from '../firebase'

const Navbar = (props) => {

    const cerrarSesion = async () => {

        try {
            await auth.signOut()
            props.history.push('login')
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div className="navbar navbar-dark bg-dark">
            <div className="container">
                <Link className='navbar-brand' to="/">CRUD</Link>
                <div>
                    <div className="d-flex">
                        <NavLink to="/" className="btn btn-dark mx-2" exact>
                            Inicio
                        </NavLink>
                        <NavLink to="/admin" className="btn btn-dark mx-2" exact>
                            Admin
                        </NavLink>
                        {
                            props.firebaseUser ? (
                                <button onClick={cerrarSesion} className='btn btn-dark mx-2'>
                                    Cerrar Sesion
                                </button>
                            ) : (
                                <NavLink to="/login" className='btn btn-dark mx-2' exact>
                                    Login
                                </NavLink>  
                            )
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Navbar)
