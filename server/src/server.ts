import express from 'express'
import cors from 'cors'
import routes from './routes'
import path from 'path'
import { errors } from 'celebrate'

const app = express();

app.use(cors())
app.use(express.json())
app.use(routes)
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.use(errors())

app.listen(3333, ()=>{
  console.log('Servidor online')
})
// Somente anotações
const anotacao = () =>{
  // Rota: Endereçoc completo de requisição
// Recurso: Qual entidade estamos acessando do sistema

// Get: Buscar uma ou mais informações
// Post: Criar uma informação
// Put: Atualizar uma informação
// Delete: Remover uma informação

// Request Param: Parâmentros que vem na prória rota que identifica um recurso
// Query Param: Parâmetros que vem na própria rota que geralmente opcionais para filtros, paginação
// Request Body: Parâmetros para criação/atualização do recurso

const users = [
  'Spencer',
  'Tulio',
  'Gustavo',
]

app.get('/users', (req, res)=>{
  const search = String(req.query.search)
  const filterUseres = search ? users.filter(users => users.includes(search)) 
  : users
  res.json(filterUseres)
})

app.get('/users/:id', (req, res)=>{
  const id = Number(req.params.id)
  const user = users[id]
  return res.json(user)
})

app.post('/users', (req, res)=>{
  const data = req.body
  const user ={
    name: data.name,
    email: data.email
  }

  return res.json(user)
})
}

