/* eslint-disable react/no-unescaped-entities */
/* eslint-disable indent */
/* eslint-disable multiline-ternary */
import React, { useEffect, useRef, useState } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import PageDefault from '../../components/PageDefault'
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form'
import DatePicker from 'react-date-picker'
import api from '../../services/api'
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'
import { format } from 'date-fns-tz'
import { useNavigate } from 'react-router-dom'
import { formatarTelefone } from '../../utils/Formatacao'
import { error, entrou, saiu } from '../../utils/Toast'
import { ToastContainer } from 'react-toastify'
import CustomModal from '../../components/CustomModal'

const App: React.FC = () => {
  const inputRef = useRef(null)
  const [data, setData] = useState(new Date())
  const [cpf, setCpf] = useState('')
  const [registros, setRegistro] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [textBoxValues, setTextBoxValues] = useState([])
  const [isModalOpen, setIsModalOpen] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    try {
      async function searchCategory() {
        const payload = {
          data
        }
        const response = await api.get('/registro', {
          params: payload
        })

        if (response.data.error) {
          console.log('Houve algum erro, por favor tente novamente.')
        } else {
          setRegistro(response.data)
        }
      }
      searchCategory()
    } catch (err) {
      console.log('Houve algum erro, por favor tente novamente.')
    }
  }, [data, refresh])

  const onChangeCalendar = value => {
    setData(value)
  }

  const onChangeCpf = event => {
    const novoCpf = event.target.value
    const cpfFormatado = novoCpf.replace(/\D/g, '')
    setCpf(cpfFormatado)
  }

  const onChangeDestino = (index, value) => {
    const newTextBoxValues = [...textBoxValues]
    newTextBoxValues[index] = value
    setTextBoxValues(newTextBoxValues)
  }

  const handleSaida = async id => {
    try {
      const response = await api.put('/registro', {
        id
      })
      if (response.data.error) {
        if (response.data.error === 'Preencha o destino.') {
          error('Preencha o destino.')
        } else {
          error('Houve algum erro, por favor tente novamente.')
        }
      } else {
        refresh === true ? setRefresh(false) : setRefresh(true)
      }
    } catch (err) {
      error('Houve algum erro.')
    }
  }

  const handleEntrada = async () => {
    try {
      if (cpf) {
        if (cpf.length === 8 || cpf.length === 11) {
          setCpf('')
          inputRef.current.focus()
          const response = await api.post('/registro', {
            cpf
          })
          if (response.data === null) {
            if (cpf.length === 8) {
              const dataToSend = { nip: cpf }
              const jsonStr = encodeURIComponent(JSON.stringify(dataToSend))
              navigate(`/cadastro/${jsonStr}`)
            } else {
              const dataToSend = { cpf }
              const jsonStr = encodeURIComponent(JSON.stringify(dataToSend))
              navigate(`/cadastro/${jsonStr}`)
            }
          } else if (response.data.error) {
            if (response.data.error === 'Preencha o destino.') {
              error('Preencha o destino.')
            } else {
              error('Houve algum erro, por favor tente novamente.')
            }
          } else {
            if (response.data.saida) {
              saiu(response.data.visitante.nome + ' saiu.')
            } else {
              entrou(response.data.visitante.nome + ' entrou.')
            }
            setRegistro(prevRegistros => [...prevRegistros, response.data])
            registros.forEach((data, index) => {
              if (data.id === response.data.id) {
                const newRegistrosValues = [...registros]
                newRegistrosValues[index] = response.data
                setRegistro(newRegistrosValues)
              }
            })
          }
        } else {
          error('Preencha um CPF/NIP válido.')
        }
      } else {
        error('Preencha o campo.')
      }
    } catch (err) {
      error('Houve algum erro.')
    }
  }

  const onKeyDownEntrada = e => {
    if (e.key === 'Enter') {
      handleEntrada()
    }
  }

  const formatarData = data => {
    const entrada = new Date(data)
    entrada.setHours(entrada.getHours() + 3)
    return format(entrada, 'dd/MM/yyyy HH:mm:ss')
  }

  const handleDestino = async (id, index) => {
    try {
      if (textBoxValues[index]) {
        const response = await api.put('/registroDestino', {
          id,
          destino: textBoxValues[index]
        })
        if (response.data.error) {
          error('Houve algum erro, por favor tente novamente.')
        } else {
          refresh === true ? setRefresh(false) : setRefresh(true)
        }
      } else {
        error('Preencha o campo.')
      }
    } catch (err) {
      error('Houve algum erro.')
    }
  }

  const handleModalOpen = index => {
    const newIsModalOpen = [...isModalOpen]
    newIsModalOpen[index] = true
    setIsModalOpen(newIsModalOpen)
  }

  const handleModalClose = index => {
    const newIsModalOpen = [...isModalOpen]
    newIsModalOpen[index] = false
    setIsModalOpen(newIsModalOpen)
  }

  return (
    <PageDefault>
      <ToastContainer />
      <Form.Group className="mb-3" controlId="cpf">
        <Form.Label>CPF / NIP</Form.Label>
        <Form.Control
          ref={inputRef}
          onChange={onChangeCpf}
          onKeyDown={onKeyDownEntrada}
          value={cpf}
          maxLength={11}
          type="text"
        />
      </Form.Group>
      <Button variant="primary" onClick={handleEntrada}>
        Dar entrada
      </Button>
      <span
        style={{
          paddingLeft: '48.5rem'
        }}
      />
      <DatePicker format="dd/MM/y" onChange={onChangeCalendar} value={data} />
      <br />
      <br />
      <Table
        striped
        bordered
        hover
        style={{
          textAlign: 'center',
          verticalAlign: 'middle'
        }}
      >
        <thead>
          <tr>
            <th>Nº</th>
            <th>Foto</th>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Destino</th>
            <th>Entrada</th>
            <th>Saída</th>
          </tr>
        </thead>
        <tbody>
          {registros.length === 0 ? (
            <tr>
              <td colSpan={7}>Não há registros...</td>
            </tr>
          ) : (
            registros.map((registro, index) => (
              <tr key={`${registro.id}`}>
                <td>{registro.numeroCracha ? registro.numeroCracha : '-'}</td>
                <td>
                  {
                    <Image
                      rounded
                      onClick={() => handleModalOpen(index)}
                      style={{
                        width: '150px',
                        cursor: 'pointer'
                      }}
                      src={'data:image/jpg;base64,' + registro.foto}
                    />
                  }
                  {
                    <CustomModal
                      isModalOpen={isModalOpen[index]}
                      handleModalClose={() => handleModalClose(index)}
                      registro={registro}
                    />
                  }
                </td>
                <td>{registro.visitante.nome}</td>
                <td>{formatarTelefone(registro.visitante.telefone)}</td>
                <td>
                  {registro.destino !== null ? (
                    registro.destino
                  ) : (
                    <div
                      style={{
                        display: 'flex'
                      }}
                    >
                      <Form.Select
                        onChange={e => onChangeDestino(index, e.target.value)}
                      >
                        <option value="">Selecione aqui</option>
                        <option value="Administração">Administração</option>
                        <option value="Alojamento de serviço">
                          Alojamento de serviço
                        </option>
                        <option value="Alojamento dos oficiais">
                          Alojamento dos oficiais
                        </option>
                        <option value="Armamento">Armamento</option>
                        <option value="Aviônica">Aviônica</option>
                        <option value="Área externa">Área externa</option>
                        <option value="Briefing">Briefing</option>
                        <option value="CQ">CQ</option>
                        <option value="Comandante">Comandante</option>
                        <option value="Fator Humano">Fator Humano</option>
                        <option value="Garagem">Garagem</option>
                        <option value="GSAR">GSAR</option>
                        <option value="Hangar">Hangar</option>
                        <option value="Imediato">Imediato</option>
                        <option value="Informática">Informática</option>
                        <option value="Inteligência">Inteligência</option>
                        <option value="Oficina MV">Oficina MV</option>
                        <option value="Oficina SV">Oficina SV</option>
                        <option value="Operações">Operações</option>
                        <option value="Pista">Pista</option>
                        <option value="Planejamento">Planejamento</option>
                        <option value="PMC">PMC</option>
                        <option value="PPU">PPU</option>
                        <option value="Praça D'Armas">Praça D'Armas</option>
                        <option value="PSO">PSO</option>
                        <option value="Sala de estar 1ºSG/SO">
                          Sala de estar 1ºSG/SO
                        </option>
                        <option value="Sala de estar 2ºSG/3ºSG">
                          Sala de estar 2ºSG/3ºSG
                        </option>
                        <option value="Sala de estar CB/MN">
                          Sala de estar CB/MN
                        </option>
                        <option value="SECOM">SECOM</option>
                        <option value="Segurança">Segurança</option>
                        <option value="Suprimentos">Suprimentos</option>
                      </Form.Select>
                      <span
                        style={{
                          paddingLeft: '10px'
                        }}
                      />
                      <Button
                        variant="success"
                        onClick={() => handleDestino(registro.id, index)}
                      >
                        OK
                      </Button>
                    </div>
                  )}
                </td>
                <td>{formatarData(registro.entrada)}</td>
                <td>
                  {registro.saida ? (
                    formatarData(registro.saida)
                  ) : (
                    <Button
                      variant="danger"
                      onClick={() => handleSaida(registro.id)}
                    >
                      Dar saída
                    </Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </PageDefault>
  )
}

export default App
