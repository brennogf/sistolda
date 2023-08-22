/* eslint-disable multiline-ternary */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import Button from 'react-bootstrap/Button'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PageDefault from '../../components/PageDefault'

function IdentidadeVerso() {
  const [img, setImg] = useState(null)
  const webcamRef = useRef(null)
  let { params } = useParams()
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
      JSON.parse(decodeURIComponent(params))
    } catch (err) {
      console.log('Houve algum erro, por favor tente novamente.')
    }
  }, [])

  const videoConstraints = {
    width: 1920,
    height: 1080,
    facingMode: 'environment'
  }

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setImg(imageSrc)
  }, [webcamRef])

  const handleEnviarFoto = () => {
    const jsonData = JSON.parse(decodeURIComponent(params))
    const dataToSend = {
      nome: jsonData.nome,
      cpf: jsonData.cpf,
      rg: jsonData.rg,
      orgaoEmissor: jsonData.orgaoEmissor,
      estado: jsonData.estado,
      nip: jsonData.nip,
      telefone: jsonData.telefone,
      destino: jsonData.destino
    }
    imagensBase64[2] = img
    const jsonStr = encodeURIComponent(JSON.stringify(dataToSend))
    navigate(`/cadastro/${jsonStr}`, { state: { imagensBase64 } })
  }

  const handleVoltar = () => {
    navigate(`/cadastro/${params}`, { state: { imagensBase64 } })
  }

  return (
    <PageDefault>
      {img === null ? (
        <>
          <div
            style={{
              paddingLeft: '4rem'
            }}
          >
            <Webcam
              audio={false}
              width={1000}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          </div>
          <span
            style={{
              paddingLeft: '30rem'
            }}
          >
            <span style={{ paddingRight: '2rem' }}>
              <Button onClick={handleVoltar} variant="danger">
                Voltar
              </Button>
            </span>
            <Button onClick={capture} variant="primary">
              Tirar foto
            </Button>
          </span>
        </>
      ) : (
        <>
          <div
            style={{
              paddingLeft: '4.5rem'
            }}
          >
            <img
              src={img}
              style={{
                paddingBottom: '0.5rem'
              }}
              alt="screenshot"
            />
          </div>
          <span
            style={{
              paddingLeft: '30rem'
            }}
          >
            <span style={{ paddingRight: '2rem' }}>
              <Button onClick={() => setImg(null)} variant="danger">
                Voltar
              </Button>
            </span>
            <Button onClick={handleEnviarFoto} variant="success">
              Enviar foto
            </Button>
          </span>
        </>
      )}
    </PageDefault>
  )
}

export default IdentidadeVerso
