import fs from 'fs'
import { v4 as uuid } from 'uuid'
// on import les modules pour résoudre les chemins : path et url
import * as path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname( fileURLToPath(import.meta.url) )

const getItems = (req, res) => {


  try {
    const data = fs.readFileSync(path.resolve(__dirname, '../db/clients.json'))
    res.send(data)  
  } catch (error) {
    res.sendStatus(500)
    throw error
  }
}

const getItem = (req, res) => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, '../db/clients.json'))
    // on converti le json en données JavaScript
    const items = JSON.parse(data)
    // on recherche l'item avec l'id passé en paramètre
    const item = items.find(item => item.id == req.params.id)
    // on renvoie l'item si il existe
    if(item){
      res.json(item)
    } else {
      // sinon on renvoie une erreur 404
      res.sendStatus(404)
    }
  } catch (error) {
    // en cas d'erreur de lecture du fichier json... on renvoie une erreur serveur
    res.sendStatus(500)
    throw error
  }
}

const patchItem = (req, res) => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, '../db/clients.json'))
    // on converti le json en données JavaScript
    const items = JSON.parse(data)
    let index = items.findIndex(item => item.id == req.params.id)
    
    // mettre à jour les données de l'item avec les données envoyées dans le body de la requête
    items[index] = {
      ...items[index],
      ...req.body,
    }
    fs.writeFileSync(path.resolve(__dirname, '../db/clients.json'), JSON.stringify(items) )
    res.json(items[index])
  } catch (error) {
    // en cas d'erreur de lecture du fichier json... on renvoie une erreur serveur
    res.sendStatus(500)
    throw error
  }
}

const postItem = (req, res) => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, '../db/clients.json'))
    // on converti le json en données JavaScript
    const items = JSON.parse(data)
    
    // on verifie les données envoyées..
    const newclient = { ...req.body, id: uuid() }

    //puis on insère la donnée dans le tableau des clients
    items.push(newclient)
    fs.writeFileSync(path.resolve(__dirname, '../db/clients.json'), JSON.stringify(items) )
    res.json(newclient)
  } catch (error) {
    // en cas d'erreur de lecture du fichier json... on renvoie une erreur serveur
    res.sendStatus(500)
    throw error
  }
}

const deleteItem = (req, res) => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, '../db/clients.json'))
    // on converti le json en données JavaScript
    let items = JSON.parse(data)
    // on recherche l'item avec l'id passé en paramètre
    items = items.filter(item => item.id != req.params.id)
    
    // on écrit le nouveau tableau de données
    fs.writeFileSync(path.resolve(__dirname, '../db/clients.json'), JSON.stringify(items))
    // 200 code http : OK
    // 201 code http : CREATED
    // 202 code http : ACCEPTED
    // 203 code http : NON-AUTHORITATIVE INFORMATION
    // 204 code http : NO CONTENT
    res.sendStatus(200)
  } catch (error) {
    // en cas d'erreur de lecture du fichier json... on renvoie une erreur serveur
    res.sendStatus(500)
    throw error
  }
}

export default {
  deleteItem,
  getItem,
  getItems,
  patchItem,
  postItem
}

