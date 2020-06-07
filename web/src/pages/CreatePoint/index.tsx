import React, { useEffect, useState } from 'react'
import {FiArrowLeft} from 'react-icons/fi'
import {Link} from 'react-router-dom'
import {Map, TileLayer, Marker} from 'react-leaflet'
import axios from 'axios'
import api from '../../services/api'

import './styles.css'

import logo from '../../assets/logo.svg'

// array ou objeto: manualmente informa o tipo da variavel
interface Item {
  id: number,
  title: string,
  image_utl: string
}

interface IBGEUFResponse {
  sigla: string
}
const CreatePoint = () =>{
  const [items, setItems] = useState<Item[]>([])
  const [ufs, setUfs] = useState<string[]>([])
  

  useEffect(()=>{
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then(response =>{
      const ufInitials =  response.data.map(
        uf => uf.sigla
      )
      
      setUfs(ufInitials)
    })
  },[])

  useEffect(()=>{
    api.get('items').then(response =>{
      setItems(response.data)
    })
  },[])

  return(
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta"/>

        <Link to='/'>
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form>
        <h1>Cadastro do <br/> ponto de coleta</h1>

        <fieldset>
          <legend>
            <h2>
              Dados
            </h2>
          </legend>

          <div className='field'>
          <label htmlFor="name">Nome da entidade</label>
          <input 
            type="text"
            name="name"
            id="name"
          />
          </div>

          <div className="field-group">
            <div className='field'>
            <label htmlFor="name">E-email</label>
            <input 
              type="email"
              name="email"
              id="email"
            />
            </div>
            <div className='field'>
            <label htmlFor="whatsaap">Whatsaap</label>
            <input 
              type="text"
              name="whatsaap"
              id="whatsaap"
            />
            </div>

          </div>
          
        </fieldset>

        <fieldset>
          <legend>
            <h2>
              Endereço
            </h2>
            <span>selecione o endereço no mapa</span>
          </legend>

          <Map center={[-16.842752,-42.0530744]} zoom={15}>
            <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[-16.842752,-42.0530744]}/>
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select name="uf" id="uf">
                <option value="0">Selecione uma UF</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="uf">Cidade</label>
              <select name="city" id="city">
                <option value="0">Selecione uma cidade</option>
              </select>
            </div>
          </div>
          
        </fieldset>

        <fieldset>
          <legend>
            <h2>
              Ítens de coleta
            </h2>
            <span>selecione um ou mais ítens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map(item =>(
              <li key={item.id}>
                <img src={item.image_utl} alt={item.title}/>
                <span>{item.title}</span>
              </li> 
            ))}
          </ul>
        </fieldset>
        <button type="submit">
          Cadastrar ponto de coleta.
        </button>
      </form>
    </div>
  )
}

export default CreatePoint