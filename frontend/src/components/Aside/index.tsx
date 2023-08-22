import {
  faCar,
  faKey,
  faPerson,
  faToolbox
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Sidebar, Menu, MenuItem, sidebarClasses } from 'react-pro-sidebar'
import { Link } from 'react-router-dom'
import Image from 'react-bootstrap/Image'
import Logo from '../../assets/logo.png'
import Fundo from '../../assets/fundo_menu_lateral.png'

export default function Aside() {
  return (
    <div
      style={{
        display: 'flex',
        position: 'fixed',
        height: '62rem'
      }}
    >
      <Sidebar
        backgroundColor="rgba(11, 41, 72, 0.9)"
        image={Fundo}
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            color: 'rgb(139, 161, 183)',
            fontSize: '0.9rem',
            fontFamily: 'Poppins'
          }
        }}
      >
        <div
          style={{
            paddingLeft: '3rem',
            paddingBottom: '2rem',
            paddingTop: '1rem'
          }}
        >
          <Link
            style={{
              textDecoration: 'none'
            }}
            to="/"
          >
            <Image
              style={{
                width: '6rem',
                marginLeft: '1.5rem'
              }}
              src={Logo}
            />
          </Link>
        </div>
        <div
          style={{
            padding: '0px 24px',
            marginBottom: '8px',
            opacity: '0.7',
            fontWeight: '600',
            letterSpacing: '0.5px',
            lineHeight: '18px',
            fontSize: '12px'
          }}
        >
          Controle
        </div>
        <Menu
          menuItemStyles={{
            button: ({ disabled }) => {
              return {
                color: disabled ? 'rgb(62, 94, 126)' : 'rgb(139, 161, 183)',
                '&:hover': {
                  backgroundColor: '#00458b'
                }
              }
            },
            icon: ({ disabled }) => {
              return {
                color: disabled ? 'rgb(62, 94, 126)' : 'rgb(89, 208, 255)'
              }
            }
          }}
        >
          <MenuItem
            component={<Link to="/" />}
            active
            icon={<FontAwesomeIcon icon={faPerson} />}
          >
            Visitantes
          </MenuItem>
          <MenuItem
            component={<Link to="" />}
            disabled
            icon={<FontAwesomeIcon icon={faKey} />}
          >
            Chaves
          </MenuItem>
          <MenuItem
            component={<Link to="" />}
            disabled
            icon={<FontAwesomeIcon icon={faToolbox} />}
          >
            Materiais
          </MenuItem>
          <MenuItem
            component={<Link to="" />}
            disabled
            icon={<FontAwesomeIcon icon={faCar} />}
          >
            Viaturas
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  )
}
