import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import {FiArrowLeft} from 'react-icons/fi'
import {Link, useHistory} from 'react-router-dom'
import {Map, TileLayer, Marker} from 'react-leaflet'
import axios from 'axios'
import {LeafletMouseEvent} from 'leaflet'
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

interface IBGECityResponse {
  nome: string
}

const CreatePoint = () =>{

  const [items, setItems] = useState<Item[]>([])
  const [ufs, setUfs] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0')
  const [city, setCity] = useState<string[]>([])
  const [selectedcity, setSelectedCity] = useState('0')
  const [initialPosition, setinitialPosition] = useState<[number, number]>([0,0])
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsaap: ''
  })
  const [selectedItems, setSelectdItems] = useState<number[]>([])
  
  const history = useHistory()

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
    if(selectedUf === '0'){
      return
    }
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/distritos?orderBy=nome`)
    .then(response =>{
      const cityNames =  response.data.map(
        city => city.nome
      )
      setCity(cityNames)
    })
  },[selectedUf])

  useEffect(()=>{
    api.get('items').then(response =>{
      setItems(response.data)
    })
  },[])

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(position =>{
      const {latitude, longitude} = position.coords

      setinitialPosition([latitude, longitude])
    })
  },[])

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
    const uf = event.target.value
    setSelectedUf(uf)
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
    const city = event.target.value
    setSelectedCity(city)
  }

  function handleMapClick(event: LeafletMouseEvent){
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng,
    ])
  }

  function handleSelectInput(event: ChangeEvent<HTMLInputElement>){
    const { name, value} = event.target

    setFormData({...formData, [name]: value})
  }

  async function handleSubmit(event : FormEvent){
    event.preventDefault()

    const { name, email, whatsaap} = formData
    const uf = selectedUf
    const city = selectedcity
    const [latitude, longitude] = selectedPosition
    const items = selectedItems

    const data = {
      name, 
      email,
      whatsaap,
      uf,
      city,
      latitude,
      longitude,
      items
    }

    await api.post('points', data)

    history.push('/')

  }

  function handleSelectItem(id: number){
    const alreadySelectd = selectedItems.findIndex(item => item === id)

    if(alreadySelectd >= 0){
      const filteredItems = selectedItems.filter(item => item !== id)
      setSelectdItems(filteredItems)
    }else{
      setSelectdItems([...selectedItems, id])
    }
  }

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
            onChange={handleSelectInput}
          />
          </div>

          <div className="field-group">
            <div className='field'>
            <label htmlFor="name">E-email</label>
            <input 
              type="email"
              name="email"
              id="email"
              onChange={handleSelectInput}
            />
            </div>
            <div className='field'>
            <label htmlFor="whatsaap">Whatsaap</label>
            <input 
              type="text"
              name="whatsaap"
              id="whatsaap"
              onChange={handleSelectInput}
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

          <Map center={/*[-16.842752,-42.0530744]*/initialPosition} zoom={15}
            onClick={handleMapClick}
          >
            <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition}/>
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select name="uf" id="uf"
                value={selectedUf}
                onChange={handleSelectUf}
              >
              <option value="0">Selecione uma UF</option>
              {ufs.map(uf =>(
                <option key={uf} value={uf}>{uf}</option>
              ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="uf">Cidade</label>
              <select name="city" id="city"
                value={selectedcity}
                onChange={handleSelectCity}
              >
                <option value="0">Selecione uma cidade</option>
                {city.map(city =>(
                <option key={city} value={city}>{city}</option>
              ))}
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
              <li 
                key={item.id} 
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
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