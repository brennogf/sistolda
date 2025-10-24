import { PrismaClient } from '.prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

interface Visitante {
  id: string
  nome: string
  cpf: string
  rg: string
  orgaoEmissor: string
  estado: string
  nip?: string
  telefone: string
  crachaProprio: boolean
}

interface Cracha {
  id: string
  numero: number
  Registro?: Registro
}

interface Registro {
  id: string
  visitante: Visitante
  entrada: Date
  saida?: Date
  destino?: string
  cracha?: Cracha
  numeroCracha?: number
}

interface RegistroComImagem {
  id: string
  visitante: Visitante
  entrada: Date
  saida?: Date
  destino?: string
  cracha?: Cracha
  numeroCracha?: number
  foto?: string
}

module.exports = {
  async store(req, res) {
    try {
      const { cpf } = req.body
      let registro = null
      const data = new Date()
      data.setHours(data.getHours() - 3)
      const novaDataString = data.toISOString()
      let imagemBase64

      // Verifica se o usuario ja deu entrada
      const usuarioJaEntrou = await prisma.registro.findFirst({
        where: {
          visitante: {
            OR: [
              {
                cpf
              },
              {
                nip: cpf
              }
            ]
          },
          saida: null
        }
      })

      if (!usuarioJaEntrou) {
        // Verifica se o visitante já está cadastrado
        const visitante = await prisma.visitante.findFirst({
          where: {
            OR: [
              {
                cpf
              },
              {
                nip: cpf
              }
            ]
          },
          select: {
            id: true,
            crachaProprio: true
          }
        })
        // Se o visitante já for cadastrado
        if (visitante) {
          //Se o visitante já tiver um crachá
          if (visitante.crachaProprio) {
            // Cria o registro sem um número de crachá
            registro = await prisma.registro.create({
              data: {
                entrada: novaDataString,
                idCracha: null,
                saida: null,
                visitanteId: visitante.id
              }, include: {
                visitante: true
              }
            })
            try {
              const nomeDiretorio = 'imagens/fotos'
              const nomeArquivo = `${registro.visitante.cpf}.jpg`
              const diretorioAtual = process.cwd()
              const caminhoParaImagem = path.join(diretorioAtual, nomeDiretorio, nomeArquivo)
              imagemBase64 = fs.readFileSync(caminhoParaImagem, { encoding: 'base64' })
            } catch (err) {
              imagemBase64 = ''
            }
            res.json({
              ...registro,
              foto: imagemBase64
            })
            // Se o visitante não tiver um crachá
          } else {

            // Verifica o próximo crachá disponível
            let cracha = await prisma.cracha.findFirst({
              where: {
                registro: null
              },
              orderBy: {
                numero: 'asc'
              }
            })

            if (!cracha) {
              cracha = {
                id: null,
                numero: null
              }
            }

            // Cria o registro com o próximo crachá
            registro = await prisma.registro.create({
              data: {
                entrada: novaDataString,
                idCracha: cracha.id,
                saida: null,
                visitanteId: visitante.id,
                numeroCracha: cracha.numero
              },
              include: {
                visitante: true
              }
            })
            try {
              const nomeDiretorio = 'imagens/fotos'
              const nomeArquivo = `${registro.visitante.cpf}.jpg`
              const diretorioAtual = process.cwd()
              const caminhoParaImagem = path.join(diretorioAtual, nomeDiretorio, nomeArquivo)
              imagemBase64 = fs.readFileSync(caminhoParaImagem, { encoding: 'base64' })
            } catch (err) {
              imagemBase64 = ''
            }
          }
          res.json({
            ...registro,
            foto: imagemBase64
          })
        } else {
          res.json(null)
        }
      } else {
        const id = usuarioJaEntrou.id
        const data = new Date()
        data.setHours(data.getHours() - 3)
        const novaDataString = data.toISOString()

        const destinoNull = await prisma.registro.findFirst({
          where: {
            id
          }
        })

        if (destinoNull.destino === null) {
          res.json({
            error: 'Preencha o destino.'
          })
        } else {
          // Altera o registro para dar a saída do visitante
          const registro = await prisma.registro.update({
            where: {
              id
            },
            data: {
              saida: novaDataString,
              idCracha: null
            },
            include: {
              visitante: true
            }
          })
          try {
            const nomeDiretorio = 'imagens/fotos'
            const nomeArquivo = `${registro.visitante.cpf}.jpg`
            const diretorioAtual = process.cwd()
            const caminhoParaImagem = path.join(diretorioAtual, nomeDiretorio, nomeArquivo)
            imagemBase64 = fs.readFileSync(caminhoParaImagem, { encoding: 'base64' })
          } catch (err) {
            imagemBase64 = ''
          }

          res.json({
            ...registro,
            foto: imagemBase64
          })
        }
      }
    } catch (err) {
      res.json({ error: err });
    }
  },
  async update(req, res) {
    try {
      const { id } = req.body

      const destinoNull = await prisma.registro.findFirst({
        where: {
          id
        }
      })

      if (destinoNull.destino === null) {
        // Altera o registro para dar a saída do visitante
        res.json({
          error: 'Preencha o destino.'
        })
      } else {
        // Altera o registro para dar a saída do visitante
        const data = new Date()
        data.setHours(data.getHours() - 3)
        const novaDataString = data.toISOString()

        const registro = await prisma.registro.update({
          where: {
            id
          },
          data: {
            saida: novaDataString,
            idCracha: null
          }
        })
        res.json(registro)
      }
    } catch (err) {
      res.json({ error: err })
    }
  },
  async index(req, res) {
    try {
      const { data } = req.query
      // Verifica os registros da data específica
      const datePart = data.split("T")[0]
      const formattedDate = `${datePart}T00:00:00.000Z`
      const formattedDate2 = `${datePart}T23:59:59.999Z`

      const registros: RegistroComImagem[] = await prisma.registro.findMany({
        where: {
          entrada: {
            gte: new Date(formattedDate),
            lt: new Date(formattedDate2)
          },
        }, include: {
          visitante: true,
          cracha: true
        },
        orderBy: {
          entrada: 'asc'
        }
      })
      registros.forEach((registro) => {
        //falta acrescentar se ja converteu antes pra n fzr dnv
        try {
          const nomeDiretorio = 'imagens/fotos'
          const nomeArquivo = `${registro.visitante.cpf}.jpg`
          const diretorioAtual = process.cwd()
          const caminhoParaImagem = path.join(diretorioAtual, nomeDiretorio, nomeArquivo)
          const imagemBase64 = fs.readFileSync(caminhoParaImagem, { encoding: 'base64' })
          registro.foto = imagemBase64
        } catch (err) {
          registro.foto = ''
        }
      })

      res.json(registros)
    } catch (err) {
      res.json({ error: err })
    }
  },
  async updateDestino(req, res) {
    try {
      const { id, destino } = req.body

      // Altera o registro para dar a saída do visitante
      const registro = await prisma.registro.update({
        where: {
          id
        },
        data: {
          destino
        }
      })
      res.json(registro)
    } catch (err) {
      res.json({ error: err })
    }
  }
}
