export const removerCaracteresNaoAlfanumericos = str => {
  return str.replace(/\W/g, '')
}

export const removerCaracteresNaoNumericos = str => {
  return str.replace(/\D/g, '')
}

export function formatarTelefone(telefone) {
  const numeroLimpo = telefone.replace(/\D/g, '')
  if (numeroLimpo.length === 10) {
    return `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(
      2,
      6
    )}-${numeroLimpo.slice(6)}`
  } else if (numeroLimpo.length === 11) {
    return `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(
      2,
      7
    )}-${numeroLimpo.slice(7)}`
  } else {
    return telefone
  }
}

export const formatarCPF = cpf => {
  const numeroLimpo = cpf.replace(/\D/g, '')
  return numeroLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export const formatarNIP = nip => {
  const nipNumerico = nip.replace(/\D/g, '')

  if (nipNumerico.length <= 2) {
    return nipNumerico
  } else if (nipNumerico.length <= 6) {
    return `${nipNumerico.slice(0, 2)}.${nipNumerico.slice(2)}`
  } else {
    return `${nipNumerico.slice(0, 2)}.${nipNumerico.slice(
      2,
      6
    )}.${nipNumerico.slice(6)}`
  }
}

export const bloquearNumeros = event => {
  const tecla = event.key
  // Verifica se a tecla é um número (0-9) ou outros caracteres indesejados
  if (/[\d~`!@#$%\\^&*()_+={}\\[\]|:;"'<>,.?\\]/.test(tecla)) {
    event.preventDefault()
  }
}

export const formatarNome = name => {
  const prepositions = ['de', 'da', 'do', 'dos', 'das']

  if (!name) return ''

  const words = name.toLowerCase().split(' ')
  const formattedWords = words.map((word, index) => {
    if (index === 0 || !prepositions.includes(word)) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    } else {
      return word
    }
  })

  return formattedWords.join(' ')
}
