import { PrismaClient } from '.prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

module.exports = {
  async store(req, res) {
    try {
      const { nome, cpf, rg, telefone, destino, nip, orgaoEmissor, estado, foto, identidadeFrente, identidadeVerso } = req.body;
      const data = new Date()
      data.setHours(data.getHours() - 3)
      const novaDataString = data.toISOString()

      // Verifica se o CPF/NIP já está cadastrado
      const consulta = await prisma.visitante.findFirst({
        where: {
          OR: [
            {
              cpf
            },
            {
              nip
            }
          ]
        }
      })

      if(!consulta) {
      // Cadastra um novo visitante
      const visitante = await prisma.visitante.create({
        data: {
          nome,
          cpf,
          crachaProprio: false,
          nip: (nip === '') ? null: nip,
          orgaoEmissor,
          estado,
          rg,
          telefone
        }
      })

      if(foto !== '') {
        const imagemSemPrefixo = foto.replace(/^data:image\/jpeg;base64,/, '')
        const imageData = Buffer.from(imagemSemPrefixo, 'base64')
        const nomeDiretorio = 'imagens/fotos'
        const nomeArquivo = `${cpf}.jpg`
        const diretorioAtual = process.cwd()
        const caminhoSalvar = path.join(diretorioAtual, nomeDiretorio, nomeArquivo)
        fs.mkdirSync(path.dirname(caminhoSalvar), { recursive: true })

        fs.writeFile(caminhoSalvar, imageData, (err) => {
          if (err) {
            console.error(err)
          }
        })
      }

      if(identidadeFrente !== '') {
        const imagemSemPrefixo = identidadeFrente.replace(/^data:image\/jpeg;base64,/, '')
        const imageData = Buffer.from(imagemSemPrefixo, 'base64')
        const nomeDiretorio = 'imagens/identidades/frente'
        const nomeArquivo = `${cpf}.jpg`
        const diretorioAtual = process.cwd()
        const caminhoSalvar = path.join(diretorioAtual, nomeDiretorio, nomeArquivo)
        fs.mkdirSync(path.dirname(caminhoSalvar), { recursive: true })

        fs.writeFile(caminhoSalvar, imageData, (err) => {
          if (err) {
            console.error(err)
          }
        })
      }

      if(identidadeVerso !== '') {
        const imagemSemPrefixo = identidadeVerso.replace(/^data:image\/jpeg;base64,/, '')
        const imageData = Buffer.from(imagemSemPrefixo, 'base64')
        const nomeDiretorio = 'imagens/identidades/verso'
        const nomeArquivo = `${cpf}.jpg`
        const diretorioAtual = process.cwd()
        const caminhoSalvar = path.join(diretorioAtual, nomeDiretorio, nomeArquivo)
        fs.mkdirSync(path.dirname(caminhoSalvar), { recursive: true })

        fs.writeFile(caminhoSalvar, imageData, (err) => {
          if (err) {
            console.error(err)
          }
        })
      }

      // Verifica o próximo crachá disponível
      let cracha = await prisma.cracha.findFirst({
        where: {
          registro: null
        },
        orderBy: {
          numero: 'asc'
        }
      })

      if(!cracha) {
        cracha = {
          id: null,
          numero: null
        }
      }

      // Cria o registro de entrada do visitante
      const registro = await prisma.registro.create({
        data: {
          idCracha: cracha.id,
          entrada: novaDataString,
          saida: null,
          visitanteId: visitante.id,
          destino,
          numeroCracha: cracha.numero
        }
      })

      res.json({
        registro,
        foto
      })
    } else if (consulta.cpf === cpf) {
      res.json({
        error: 'CPF ja cadastrado.'
      })
    } else if(consulta.nip === nip) {
      res.json({
        error: 'NIP ja cadastrado.'
      })
    }
    } catch (err) {
      res.json({ error: err })
    }
  }
}
