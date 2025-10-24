<h1 align="center">
    SisTolda
</h1>

<h4 align="center">
    Sistema de registro de visitantes.
</h4>

<p align="center">
 <img width="640" height="300" alt="image" src="https://github.com/user-attachments/assets/b5736101-d707-428b-91b9-d847391cca14">
</p>

## :memo: Descrição

Este sistema foi desenvolvido para a Marinha do Brasil com o objetivo de reforçar a segurança e o controle de acesso de visitantes à Organização Militar (OM).
O sistema realiza o registro completo das pessoas que visitam a unidade, armazenando informações como nome, CPF, RG, NIP (no caso de militares), telefone e destino.

Além disso, é possível anexar fotos da pessoa e de seu documento de identidade.
Após o primeiro cadastro, não é necessário refazer o registro — basta informar o CPF ou NIP para gerar uma nova entrada rapidamente.

O sistema também permite consultar o histórico de visitas de qualquer data, garantindo rastreabilidade e eficiência no controle de acessos.

Ele funciona tanto como aplicação web (site) quanto como software para desktop, compatível com Windows e Linux.

## :link: Links

- [Demonstração](https://sistolda.onrender.com)
- [Vídeo](https://drive.google.com/file/d/1G7iHFogsMUYO3ZqamvhgqLUbQFSay4tb/view?usp=drive_link)

## :rocket: Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

- [NodeJS](https://nodejs.org/)
- [ReactJS](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Electron](https://www.electronjs.org/)

## :information_source: Como usar

Para clonar e executar este aplicativo, você precisará [Git](https://git-scm.com), [npm](https://www.npmjs.com), [Docker](https://www.docker.com) e [Node.js v12.18](https://nodejs.org/) ou superior instalado em seu computador. Na sua linha de comando:

```bash
# Clone este repositório
$ git clone https://github.com/brennogf/sistolda

# Inicie o Docker
$ cd sistolda
$ docker-compose up -d

# Instale as dependências
$ cd frontend
$ npm install --frozen-lockfile --legacy-peer-deps
$ cd ../api
$ npm install --frozen-lockfile --legacy-peer-deps

# Prepare o banco de dados
# Renomeia o arquivo ".env.example" para ".env"
$ npm run migrate

# Execute o frontend e backend
$ npm run dev

# Se quiser executar o aplicativo desktop com electron
# Em outro terminal
$ cd sistolda/desktop
$ npm run dev
```

## :memo: Licença

Este projeto está sob licença do MIT. Veja o [LICENSE](https://github.com/brennogf/sistolda/blob/main/LICENSE) para mais informações.

---

Feito com ♥ por Brenno Givigier :wave: [Entre em contato!](https://www.linkedin.com/in/brenno-givigier/)
