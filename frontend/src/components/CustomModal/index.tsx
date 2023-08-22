import React from 'react'
import { Modal, Button, Image } from 'react-bootstrap'

function CustomModal({ isModalOpen, handleModalClose, registro }) {
  return (
    <Modal
      show={isModalOpen}
      onHide={handleModalClose}
      dialogClassName="modal-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {registro.visitante.nome}
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
          src={'data:image/jpg;base64,' + registro.foto}
          alt="Imagem ampliada"
          style={{ width: '100%', maxHeight: '80vh' }}
        />
      </Modal.Body>
    </Modal>
  )
}

export default CustomModal
