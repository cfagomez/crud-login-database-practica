import React from 'react'
import {auth} from '../firebase'
import { withRouter } from 'react-router-dom'

const Reset = (props) => {

    const [email, setEmail] = React.useState('')
    const [error, setError] = React.useState(null)

    const cambiarContraseña = async (e) => {

        e.preventDefault()

        if (!email.trim()) {

            setError('Campo vacio')
            return

        }

        try {
            await auth.sendPasswordResetEmail(email)
            props.history.push('login')
        } catch (error) {
            console.log(error)
        }
        
        setError(null)

    }

    return (
        <div className='container mt-3'>
            <div className="row justify-content-center text-center">
                <div className="col-md-6">
                    <h3>Cambiar contraseña</h3>
                    <form onSubmit={cambiarContraseña}>
                        {
                            error ? (
                                <div className='alert alert-danger'>{error}</div>
                            ) : (
                                null
                            )
                        }
                        <input 
                            type="email"
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='form-control mt-3'
                        />
                        <button type="submit" className='btn btn-primary btn-block mt-3'>
                            Enviar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Reset)
