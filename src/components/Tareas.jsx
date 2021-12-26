import React from 'react'
import {db} from '../firebase'
import 'moment/locale/es'
import moment from 'moment'

function Tareas(props) {

  const [tarea, setTarea] = React.useState('')
  const [listaTareas, setListaTareas] = React.useState([])
  const [error, setError] = React.useState('')
  const [modoEdicion, setModoEdicion] = React.useState(false)
  const [id, setId] = React.useState('')
  const [ultimo, setUltimo] = React.useState('')
  const [desactivar, setDesactivar] = React.useState(false)

  React.useEffect( () => {

    setDesactivar(true)

    const obtenerDatos = async () => {

      try {

        const data = await db.collection(props.user.uid).limit(3).orderBy('fecha', 'desc').get()
 
        const arrayData = data.docs.map((item) => (
          {
            id: item.id,
            ...item.data()
          }
        ))
 
        setListaTareas(arrayData)

        setUltimo(data.docs[data.docs.length - 1])

        const query = await db.collection(props.user.uid)
          .limit(3)
          .orderBy('fecha', 'desc')
          .startAfter(ultimo)
          .get()

        if (query.empty) {
          setDesactivar(true)
        } else {
          setDesactivar(false)
        }

     } catch (error) {
 
       console.log(error)
 
     }

    }

    obtenerDatos()

  }, [props.user.uid])

  const agregarTarea = async (e) => {

    e.preventDefault()

    if (!tarea.trim()) {

      setError('Campo vacio')
      return

    }

    try {

      const data = await db.collection(props.user.uid).add({
        nombre: tarea,
        fecha: moment(Date.now()).format('LLL')
      })

      setListaTareas([
        ...listaTareas, {
          nombre: tarea,
          id: data.id
        }
      ])

      console.log(data)

    } catch (error) {

      console.log(error)

    }

    setTarea('')
    setError(null)

  }

  const activarModoEdicion = ((item) => {

    setTarea(item.nombre)
    setId(item.id)
    setModoEdicion(true)

  })

  const editarTarea = async (e) => {

    e.preventDefault()

    if (!tarea.trim()) {

      setError('Campo vacio')
      return

    }

    try {

      await db.collection(props.user.uid).doc(id).update({
        nombre: tarea
      })

    } catch (error) {

      console.log(error)

    }

    const arrayEditado = listaTareas.map ((item) => item.id === id ? {nombre: tarea, id: id} : item)

    setListaTareas(arrayEditado)

    setTarea('')
    setId('')
    setModoEdicion(false)
    setError(null)

  }

  const eliminarTarea =  async (id) => {

    try {

      await db.collection(props.user.uid).doc(id).delete()

    } catch (error) {
      console.log (error)
    }

    const arrayFiltrado = listaTareas.filter((item) => item.id !== id)

    setListaTareas(arrayFiltrado)

  }

  const siguiente = async () => {

    try {

      const data = await db.collection(props.user.uid)
        .limit(3)
        .orderBy('fecha', 'desc')
        .startAfter(ultimo)
        .get()

      const arrayData = data.docs.map((item) => (
        {
          id: item.id,
          ...item.data()
        }
      ))

      setListaTareas([
        ...listaTareas, ...arrayData
      ])

      setUltimo(data.docs[data.docs.length - 1])

      const query = await db.collection(props.user.uid)
        .limit(3)
        .orderBy('fecha', 'desc')
        .startAfter(data.docs[data.docs.length - 1])
        .get()

      if (query.empty) {
        setDesactivar(true) 
      } else {
        setDesactivar(false)
      }

    } catch (error) {

      console.log(error)

    }

  }

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6 text-center">
          <h3>Lista de tareas</h3>
          <ul className="list-group mt-3">
            {
              listaTareas.map(item => (
                <li key={item.id} className="list-group-item">
                  {item.nombre}
                  <button onClick={() => activarModoEdicion(item)} className='btn btn-warning btn-sm btn-block float-end mx-2'>Editar</button>
                  <button onClick={() => eliminarTarea(item.id)} className='btn btn-danger btn-sm btn-block float-end'>Eliminar</button>
                </li>
              ))
            }
            
          </ul>
          <button disabled={desactivar} onClick={siguiente} className='btn btn-primary mt-2 btn-sm btn-block'>Siguiente</button>
        </div>
        <div className="col-md-6 text-center">
          <h3>
            {
              modoEdicion ? 'Editar tarea' : 'Agregar tarea'
            }
          </h3>
          <form onSubmit={modoEdicion ? editarTarea : agregarTarea}>
            {
              error ? (
                <div className='alert alert-danger'>{error}</div>
              ) : (
                null
              )
            }
            <input 
              type="text"
              placeholder="Tarea..."
              className="form-control mt-3"
              onChange={(e) => setTarea (e.target.value)}
              value={tarea}
            />
            <button 
              className={modoEdicion ? "btn btn-warning btn-sm btn-block mt-2" : "btn btn-primary btn-sm btn-block mt-2"}
              type='submit'
            >
              {
                modoEdicion ? 'Editar' : 'Agregar'
              }
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Tareas;
