import { useState, useEffect } from 'react'
import './App.css'
import { listaInvitados, type Invitado } from './invitados'

type Step = 'buscar' | 'confirmar' | 'yaConfirmado' | 'completado'

interface ConfirmacionData {
  invitadoId: number
  nombre: string
  telefono: string
  asistencia: 'si' | 'no'
  asistentes: number
  faltantes: string
}

function App() {
  const [step, setStep] = useState<Step>('buscar')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredInvitados, setFilteredInvitados] = useState<Invitado[]>([])
  const [selectedInvitado, setSelectedInvitado] = useState<Invitado | null>(null)
  const [formData, setFormData] = useState<ConfirmacionData>({
    invitadoId: 0,
    nombre: '',
    telefono: '',
    asistencia: 'si',
    asistentes: 0,
    faltantes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  // Filtrar invitados mientras escribe con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        const filtered = listaInvitados.filter(inv =>
          inv.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredInvitados(filtered)
      } else {
        setFilteredInvitados([])
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleSelectInvitado = async (invitado: Invitado) => {
    setSelectedInvitado(invitado)
    setFormData(prev => ({
      ...prev,
      invitadoId: invitado.id,
      nombre: invitado.nombre,
      asistentes: invitado.invitados + invitado.adicional
    }))

    // Verificar si ya confirmó antes
    const yaConfirmo = await verificarConfirmacion(invitado.id)
    if (yaConfirmo) {
      setStep('yaConfirmado')
    } else {
      setStep('confirmar')
    }
  }

  const verificarConfirmacion = async (invitadoId: number): Promise<boolean> => {
    try {
      const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzNLhv-fUQyr1LIgYoZqAzDLA0tR0jGAJL0Rss_BEXGWxkKLGR8xHB35znz9uqZtRWP/exec'
      const params = new URLSearchParams()
      params.append('action', 'verificar')
      params.append('invitadoId', invitadoId.toString())

      const response = await fetch(`${scriptUrl}?${params.toString()}`, {
        method: 'GET',
        mode: 'cors'
      })

      const data = await response.json()
      return data.yaConfirmo === true
    } catch (error) {
      console.error('Error verificando confirmación:', error)
      return false
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'asistentes' ? parseInt(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzNLhv-fUQyr1LIgYoZqAzDLA0tR0jGAJL0Rss_BEXGWxkKLGR8xHB35znz9uqZtRWP/exec'
      
      const params = new URLSearchParams()
      params.append('action', 'confirmar')
      params.append('invitadoId', formData.invitadoId.toString())
      params.append('nombre', formData.nombre)
      params.append('telefono', formData.telefono)
      params.append('asistencia', formData.asistencia)
      params.append('asistentes', formData.asistentes.toString())
      params.append('faltantes', formData.faltantes)

      await fetch(`${scriptUrl}?${params.toString()}`, {
        method: 'GET',
        mode: 'no-cors'
      })

      setStep('completado')
      setSubmitMessage('¡Gracias por confirmar tu asistencia!')
    } catch (error) {
      console.error('Error al enviar:', error)
      setSubmitMessage('Hubo un error al enviar el formulario. Por favor intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const reiniciar = () => {
    setStep('buscar')
    setSearchTerm('')
    setSelectedInvitado(null)
    setFormData({
      invitadoId: 0,
      nombre: '',
      telefono: '',
      asistencia: 'si',
      asistentes: 0,
      faltantes: ''
    })
    setSubmitMessage('')
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="nombres-boda">
          <span className="nombre-novia">Dana</span>
          <span className="ampersand">&</span>
          <span className="nombre-novio">Bladimir</span>
        </div>
        <p className="subtitulo-header">Por favor confirma tu asistencia</p>
      </header>
      
      <main className="form-container">
        {step === 'buscar' && (
          <div className="search-section">
            <h2>Busca tu nombre en la lista de invitados</h2>
            <div className="form-group">
              <input
                type="text"
                placeholder="Escribe tu nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                autoFocus
              />
            </div>

            {filteredInvitados.length > 0 && (
              <div className="invitados-list">
                {filteredInvitados.map(invitado => (
                  <button
                    key={invitado.id}
                    className="invitado-item"
                    onClick={() => handleSelectInvitado(invitado)}
                  >
                    <div className="invitado-nombre">{invitado.nombre}</div>
                    <div className="invitado-info">
                      {invitado.invitados} {invitado.invitados === 1 ? 'invitado' : 'invitados'}
                      {invitado.adicional > 0 && ` + ${invitado.adicional} adicional${invitado.adicional > 1 ? 'es' : ''}`}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searchTerm.length >= 2 && filteredInvitados.length === 0 && (
              <p className="no-results">No se encontraron coincidencias. Verifica la ortografía.</p>
            )}
          </div>
        )}

        {step === 'yaConfirmado' && (
          <div className="already-confirmed">
            <div className="success-icon">✓</div>
            <h2>Ya has confirmado tu asistencia</h2>
            <p>Hola <strong>{selectedInvitado?.nombre}</strong>,</p>
            <p>Ya registraste tu confirmación anteriormente.</p>
            <p>¡Nos vemos en la boda!</p>
            <button onClick={reiniciar} className="btn-secondary">
              Buscar otro invitado
            </button>
          </div>
        )}

        {step === 'confirmar' && selectedInvitado && (
          <div className="confirmation-section">
            <h2>Hola, {selectedInvitado.nombre}!</h2>
            <p className="invitacion-info">
              Tienes <strong>{selectedInvitado.invitados + selectedInvitado.adicional}</strong> {selectedInvitado.invitados + selectedInvitado.adicional === 1 ? 'lugar' : 'lugares'} confirmados
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="asistencia">¿Confirmas tu asistencia? *</label>
                <select
                  id="asistencia"
                  name="asistencia"
                  value={formData.asistencia}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="si">Sí, asistiré</option>
                  <option value="no">No podré asistir</option>
                </select>
              </div>

              {formData.asistencia === 'si' && (
                <>
                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="asistentes">¿Cuántos van a asistir? *</label>
                    <input
                      type="number"
                      id="asistentes"
                      name="asistentes"
                      min="0"
                      max={selectedInvitado.invitados + selectedInvitado.adicional}
                      value={formData.asistentes}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      required
                    />
                    <small>Máximo: {selectedInvitado.invitados + selectedInvitado.adicional}</small>
                  </div>

                  {formData.asistentes < (selectedInvitado.invitados + selectedInvitado.adicional) && (
                    <div className="form-group">
                      <label htmlFor="faltantes">¿Quién(es) no podrá(n) asistir?</label>
                      <input
                        type="text"
                        id="faltantes"
                        name="faltantes"
                        value={formData.faltantes}
                        onChange={handleChange}
                        placeholder="Ej: Mi esposo/a, mi hijo, etc."
                        disabled={isSubmitting}
                      />
                    </div>
                  )}
                </>
              )}

              <div className="button-group">
                <button type="button" onClick={reiniciar} className="btn-secondary" disabled={isSubmitting}>
                  Cancelar
                </button>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar confirmación'}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'completado' && (
          <div className="success-section">
            <div className="success-icon">✓</div>
            <h2>{submitMessage}</h2>
            <p>Hemos registrado tu confirmación exitosamente.</p>
            <p>¡Te esperamos!</p>
            <button onClick={reiniciar} className="btn-secondary">
              Confirmar otro invitado
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Sistema de confirmación para nuestra boda</p>
      </footer>
    </div>
  )
}

export default App
