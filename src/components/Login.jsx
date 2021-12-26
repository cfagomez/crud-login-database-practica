import React from 'react'
import { auth } from '../firebase'
import {withRouter} from 'react-router-dom'
import { db } from '../firebase'
import { Link } from 'react-router-dom'

const Login = (props) => {

    const [email, setEmail] = React.useState('')
    const [contraseña, setContraseña] = React.useState('')
    const [error, setError] = React.useState(null)
    const [modoRegistro, setModoRegistro] = React.useState(true)

    const validacionDatos = (e) => {

        e.preventDefault()

        if (!email.trim()) {
            setError('Campo vacio')
            return
        }

        if (!contraseña.trim()) {
            setError('Campo vacio')
            return
        }

        if (modoRegistro) {
            registrar()
        } else {
            login()
        }
        
        setError(null)

    }

    const registrar = React.useCallback( async () => {

        try {
            const res = await auth.createUserWithEmailAndPassword (email, contraseña)
            await db.collection('usuarios').doc(res.user.uid).set({
                email: res.user.email,
                id: res.user.uid
            })
            await db.collection(res.user.uid).add({
                nombre: 'Tarea de ejemplo',
                fecha: Date.now()
            })
            console.log(res.user)
            props.history.push('admin')
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setError(error.message)
            }
        }

    }, [email, contraseña, props.history]
    )

    const login = React.useCallback((async () => {

        try {
            const res = await auth.signInWithEmailAndPassword (email, contraseña)
            props.history.push('admin')
            console.log(res)
        } catch (error) {
            console.log(error)
        }

    }

    ), [email, contraseña, props.history])

    return (
        <div className='container mt-3'>
            <h3 className='text-center'>
                {modoRegistro ? 'Registro de usuarios' : 'Acceso de usuarios'}
            </h3>
            <div className="row justify-content-center mt-3">
                <div className="col-md-6 text-center">
                    <form onSubmit={validacionDatos}>
                        {
                            error ? (
                                <div className='alert alert-danger'>{error}</div>
                            ) : (
                                null
                            )
                        }
                        <input 
                            className='form-control mb-2' 
                            type="email"
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input 
                            className='form-control mb-2' 
                            type="password"
                            placeholder='Contraseña'
                            value={contraseña}
                            onChange={(e) => setContraseña(e.target.value)}
                        />

                        <button type="submit" className='btn btn-primary btn-md w-100 mt-3'>
                            {
                                modoRegistro ? 'Registrarse' : 'Acceder'
                            }
                        </button>
                        <button type="button" onClick={() => setModoRegistro(!modoRegistro)} className='btn btn-danger btn-md w-100 mt-3'>
                            {
                                modoRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'
                            }
                        </button>
                        <Link to="/reset" type="button" className='btn btn-warning btn-sm w-100 mt-3'>¿Has olvidado tu contraseña?</Link>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Login)
