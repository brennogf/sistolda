/* eslint-disable react/no-unescaped-entities */
/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Image from 'react-bootstrap/Image'
import PageDefault from '../../components/PageDefault'
import api from '../../services/api'
import {
  formatarCPF,
  formatarNIP,
  formatarTelefone,
  removerCaracteresNaoAlfanumericos,
  removerCaracteresNaoNumericos,
  bloquearNumeros,
  formatarNome
} from '../../utils/Formatacao'
import listaEstados from '../../utils/estado.json'
import listaOrgaoEmissor from '../../utils/orgaoEmissor.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { error } from '../../utils/Toast'
import { ToastContainer } from 'react-toastify'

const Cadastro: React.FC = () => {
  let { params } = useParams()

  const [cpf, setCpf] = useState('')
  const [nome, setNome] = useState('')
  const [rg, setRg] = useState('')
  const [nip, setNip] = useState('')
  const [orgaoEmissor, setOrgaoEmissor] = useState('')
  const [estado, setEstado] = useState('')
  const [telefone, setTelefone] = useState('')
  const [destino, setDestino] = useState('')
  const [foto, setFoto] = useState(null)
  const [identidadeFrente, setIdentidadeFrente] = useState(null)
  const [identidadeVerso, setIdentidadeVerso] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const [isModalOpen3, setIsModalOpen3] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { imagensBase64 } = location.state || {
    imagensBase64: [null, null, null]
  }

  useEffect(() => {
    try {
      if (params === undefined) {
        params = ''
      }
      const jsonData = JSON.parse(decodeURIComponent(params))
      if (jsonData.nip) {
        setNip(formatarNIP(jsonData.nip))
      }
      if (jsonData.cpf) {
        setCpf(formatarCPF(jsonData.cpf))
      }
      if (jsonData.nome) {
        setNome(jsonData.nome)
      }
      if (jsonData.rg) {
        setRg(jsonData.rg)
      }
      if (jsonData.orgaoEmissor) {
        setOrgaoEmissor(jsonData.orgaoEmissor)
      }
      if (jsonData.estado) {
        setEstado(jsonData.estado)
      }
      if (jsonData.telefone) {
        setTelefone(jsonData.telefone)
      }
      if (jsonData.destino) {
        setDestino(jsonData.destino)
      }
      if (imagensBase64[0] !== null) {
        setFoto(imagensBase64[0])
      }
      if (imagensBase64[1] !== null) {
        setIdentidadeFrente(imagensBase64[1])
      }
      if (imagensBase64[2] !== null) {
        setIdentidadeVerso(imagensBase64[2])
      }
    } catch (err) {
      console.log('Houve algum erro, por favor tente novamente.')
    }
  }, [])

  const handleCadastrar = async () => {
    try {
      if (
        foto !== '' &&
        identidadeFrente !== '' &&
        identidadeVerso !== '' &&
        cpf !== '' &&
        nome !== '' &&
        rg !== '' &&
        telefone !== '' &&
        orgaoEmissor !== '' &&
        estado !== '' &&
        destino !== ''
      ) {
        const response = await api.post('/visitante', {
          nome,
          cpf: removerCaracteresNaoNumericos(cpf),
          rg,
          telefone: removerCaracteresNaoNumericos(telefone),
          destino,
          nip: removerCaracteresNaoAlfanumericos(nip),
          orgaoEmissor,
          estado,
          foto,
          identidadeFrente,
          identidadeVerso
        })
        if (response.data.error) {
          if (response.data.error === 'CPF ja cadastrado.') {
            error('CPF ja cadastrado.')
          } else if (response.data.error === 'NIP ja cadastrado.') {
            error('NIP ja cadastrado.')
          } else {
            console.log(response.data.error)
          }
        } else {
          navigate('/')
        }
      } else {
        error('Preencha todos os campos.')
      }
    } catch (err) {
      error('Houve algum erro.')
    }
  }

  const handleModalOpen = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleModalOpen2 = () => {
    setIsModalOpen2(true)
  }

  const handleModalClose2 = () => {
    setIsModalOpen2(false)
  }

  const handleModalOpen3 = () => {
    setIsModalOpen3(true)
  }

  const handleModalClose3 = () => {
    setIsModalOpen3(false)
  }

  const handleTirarFoto = () => {
    const dataToSend = {
      nome,
      cpf,
      rg,
      orgaoEmissor,
      estado,
      nip,
      telefone,
      destino
    }
    const jsonStr = encodeURIComponent(JSON.stringify(dataToSend))
    navigate(`/foto/${jsonStr}`, { state: { imagensBase64 } })
  }

  const handleTirarFotoIdentidadeFrente = () => {
    const dataToSend = {
      nome,
      cpf,
      rg,
      orgaoEmissor,
      estado,
      nip,
      telefone,
      destino
    }
    const jsonStr = encodeURIComponent(JSON.stringify(dataToSend))
    navigate(`/identidadeFrente/${jsonStr}`, { state: { imagensBase64 } })
  }

  const handleTirarFotoIdentidadeVerso = () => {
    const dataToSend = {
      nome,
      cpf,
      rg,
      orgaoEmissor,
      estado,
      nip,
      telefone,
      destino
    }
    const jsonStr = encodeURIComponent(JSON.stringify(dataToSend))
    navigate(`/identidadeVerso/${jsonStr}`, { state: { imagensBase64 } })
  }

  const handleExcluirFoto = () => {
    imagensBase64[0] = null
    setFoto(null)
    setIsModalOpen(false)
  }

  const handleExcluirFotoIdentidadeFrente = () => {
    imagensBase64[1] = null
    setIdentidadeFrente(null)
    setIsModalOpen2(false)
  }

  const handleExcluirFotoIdentidadeVerso = () => {
    imagensBase64[2] = null
    setIdentidadeVerso(null)
    setIsModalOpen3(false)
  }

  const onChangeNome = event => {
    const novoNome = event.target.value
    const nomeFormatado = formatarNome(novoNome)
    setNome(nomeFormatado)
  }

  const onChangeCpf = event => {
    const novoCPF = event.target.value
    const cpfFormatado = formatarCPF(novoCPF)
    setCpf(cpfFormatado)
  }

  const onChangeNip = event => {
    const novoNIP = event.target.value
    const nipFormatado = formatarNIP(novoNIP)
    setNip(nipFormatado)
  }

  const onChangeRg = event => {
    const novoRg = event.target.value
    const rgFormatado = novoRg.replace(/\D/g, '')
    setRg(rgFormatado)
  }

  const onChangeOrgaoEmissor = event => {
    setOrgaoEmissor(event.target.value)
  }

  const onChangeEstado = event => {
    setEstado(event.target.value)
  }

  const onChangeTelefone = event => {
    const novoTelefone = event.target.value
    const telefoneApenasNumeros = novoTelefone.replace(/\D/g, '')
    const telefoneFormatado = formatarTelefone(telefoneApenasNumeros)
    setTelefone(telefoneFormatado)
  }

  const onChangeDestino = event => {
    setDestino(event.target.value)
  }

  interface UF {
    nome: string
    sigla: string
  }

  interface Orgaos {
    value: string
    label: string
  }

  return (
    <PageDefault>
      <ToastContainer />
      <Form>
        <div
          style={{
            display: 'flex'
          }}
        >
          <Form.Group
            style={{
              paddingRight: '3rem',
              textAlign: 'center'
            }}
            className="mb-3"
            controlId="foto"
          >
            <Form.Label>Foto</Form.Label>
            <br />
            <div>
              {foto !== null ? (
                <Image
                  rounded
                  onClick={handleModalOpen}
                  style={{
                    width: '120px',
                    cursor: 'pointer'
                  }}
                  src={foto}
                />
              ) : (
                <Button onClick={handleTirarFoto} variant="primary">
                  Tirar foto
                </Button>
              )}

              <Modal
                show={isModalOpen}
                onHide={handleModalClose}
                dialogClassName="modal-lg"
              >
                <Modal.Header closeButton>
                  <FontAwesomeIcon
                    onClick={handleExcluirFoto}
                    color="red"
                    style={{
                      cursor: 'pointer'
                    }}
                    icon={faTrashCan}
                  />
                  <span
                    style={{
                      paddingLeft: '1rem'
                    }}
                  >
                    Foto
                  </span>
                  <Modal.Title>
                    <Button
                      variant="link"
                      onClick={handleModalClose}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        fontSize: '24px',
                        color: '#000',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    ></Button>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Image
                    src={foto}
                    alt="Imagem ampliada"
                    style={{ width: '100%', maxHeight: '80vh' }}
                  />
                </Modal.Body>
              </Modal>
            </div>
          </Form.Group>
          <Form.Group
            style={{
              paddingRight: '3rem',
              textAlign: 'center'
            }}
            className="mb-3"
            controlId="identidadeFrente"
          >
            <Form.Label>Identidade - Frente</Form.Label>
            <br />
            <div>
              {identidadeFrente !== null ? (
                <Image
                  rounded
                  onClick={handleModalOpen2}
                  style={{
                    width: '120px',
                    cursor: 'pointer'
                  }}
                  src={identidadeFrente}
                />
              ) : (
                <Button
                  onClick={handleTirarFotoIdentidadeFrente}
                  variant="primary"
                >
                  Tirar foto
                </Button>
              )}

              <Modal
                show={isModalOpen2}
                onHide={handleModalClose2}
                dialogClassName="modal-lg"
              >
                <Modal.Header closeButton>
                  <FontAwesomeIcon
                    onClick={handleExcluirFotoIdentidadeFrente}
                    color="red"
                    style={{
                      cursor: 'pointer'
                    }}
                    icon={faTrashCan}
                  />
                  <span
                    style={{
                      paddingLeft: '1rem'
                    }}
                  >
                    Identidade - Frente
                  </span>
                  <Modal.Title>
                    <Button
                      variant="link"
                      onClick={handleModalClose2}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        fontSize: '24px',
                        color: '#000',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    ></Button>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Image
                    src={identidadeFrente}
                    alt="Imagem ampliada"
                    style={{ width: '100%', maxHeight: '80vh' }}
                  />
                </Modal.Body>
              </Modal>
            </div>
          </Form.Group>
          <Form.Group
            style={{
              textAlign: 'center'
            }}
            className="mb-3"
            controlId="identidadeVerso"
          >
            <Form.Label>Identidade - Verso</Form.Label>
            <br />
            <div>
              {identidadeVerso !== null ? (
                <Image
                  rounded
                  onClick={handleModalOpen3}
                  style={{
                    width: '120px',
                    cursor: 'pointer'
                  }}
                  src={identidadeVerso}
                />
              ) : (
                <Button
                  onClick={handleTirarFotoIdentidadeVerso}
                  variant="primary"
                >
                  Tirar foto
                </Button>
              )}

              <Modal
                show={isModalOpen3}
                onHide={handleModalClose3}
                dialogClassName="modal-lg"
              >
                <Modal.Header closeButton>
                  <FontAwesomeIcon
                    onClick={handleExcluirFotoIdentidadeVerso}
                    color="red"
                    style={{
                      cursor: 'pointer'
                    }}
                    icon={faTrashCan}
                  />
                  <span
                    style={{
                      paddingLeft: '1rem'
                    }}
                  >
                    Identidade - Verso
                  </span>
                  <Modal.Title>
                    <Button
                      variant="link"
                      onClick={handleModalClose3}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        fontSize: '24px',
                        color: '#000',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    ></Button>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Image
                    src={identidadeVerso}
                    alt="Imagem ampliada"
                    style={{ width: '100%', maxHeight: '80vh' }}
                  />
                </Modal.Body>
              </Modal>
            </div>
          </Form.Group>
        </div>
        <Form.Group className="mb-3" controlId="nome">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            onKeyDown={bloquearNumeros}
            maxLength={55}
            onChange={onChangeNome}
            value={nome}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="cpf">
          <Form.Label>CPF</Form.Label>
          <Form.Control
            type="text"
            maxLength={14}
            onChange={onChangeCpf}
            value={cpf}
          />
        </Form.Group>
        <div
          style={{
            display: 'flex'
          }}
        >
          <Form.Group
            style={{
              paddingRight: '1rem'
            }}
            className="mb-3"
            controlId="rg"
          >
            <Form.Label>RG</Form.Label>
            <Form.Control
              type="text"
              maxLength={12}
              onChange={onChangeRg}
              value={rg}
            />
          </Form.Group>
          <Form.Group
            style={{
              paddingRight: '1rem'
            }}
            className="mb-3"
            controlId="orgaoEmissor"
          >
            <Form.Label>Órgão emissor</Form.Label>
            <Form.Select onChange={onChangeOrgaoEmissor} value={orgaoEmissor}>
              <option value="">Selecione aqui</option>
              {listaOrgaoEmissor.orgaos.map((option: Orgaos) => (
                <option key={option.value} value={option.value}>
                  {option.value}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="estado">
            <Form.Label>Estado</Form.Label>
            <Form.Select onChange={onChangeEstado} value={estado}>
              <option value="">Selecione aqui</option>
              {listaEstados.UF.map((option: UF) => (
                <option
                  key={option.sigla}
                  value={`${option.sigla} - ${option.nome}`}
                >
                  {`${option.sigla} - ${option.nome}`}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>
        <Form.Group className="mb-3" controlId="nip">
          <Form.Label>NIP (opcional)</Form.Label>
          <Form.Control
            maxLength={10}
            type="text"
            onChange={onChangeNip}
            value={nip}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="telefone">
          <Form.Label>Telefone</Form.Label>
          <Form.Control
            type="text"
            maxLength={15}
            onChange={onChangeTelefone}
            value={telefone}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="destino">
          <Form.Label>Destino</Form.Label>
          <Form.Select onChange={onChangeDestino} value={destino}>
            <option value="">Selecione aqui</option>
            <option value="Administração">Administração</option>
            <option value="Alojamento de serviço">Alojamento de serviço</option>
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
            <option value="Sala de estar 1ºSG/SO">Sala de estar 1ºSG/SO</option>
            <option value="Sala de estar 2ºSG/3ºSG">
              Sala de estar 2ºSG/3ºSG
            </option>
            <option value="Sala de estar CB/MN">Sala de estar CB/MN</option>
            <option value="SECOM">SECOM</option>
            <option value="Segurança">Segurança</option>
            <option value="Suprimentos">Suprimentos</option>
          </Form.Select>
        </Form.Group>
      </Form>
      <span style={{ paddingRight: '2rem' }}>
        <Link to="/">
          <Button variant="danger">Voltar</Button>
        </Link>
      </span>
      <Button variant="primary" onClick={handleCadastrar}>
        Cadastrar
      </Button>
      <p />
    </PageDefault>
  )
}

export default Cadastro
