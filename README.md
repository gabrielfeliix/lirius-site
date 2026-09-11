# Lírios Floricultura

Site estático da Lírios Floricultura, publicado na Vercel.

## Estrutura

A raiz do repositório **é** o site publicado — o que está aqui é exatamente o que vai para o ar.

```
index.html                    página inicial
<slug>/index.html             uma pasta por produto do catálogo
styles.css                    folha de estilo única
script.js                     carrossel, animações, ano do rodapé
sw.js                         service worker (cache offline)
vercel.json                   trailingSlash e cache do service worker
images/                       imagens do site e do catálogo (600x800 nos produtos)
_arquivo/                     versão antiga, fora do deploy (ver .vercelignore)
```

## Paleta

Creme como papel, vinho como tinta, ouro como filete — derivada da logo.
Todas as cores estão no bloco `:root` do `styles.css`.

| Variável | Uso |
| --- | --- |
| `--clr-bg-main` / `--clr-bg-secondary` | fundos creme |
| `--clr-primary` | vinho em superfícies (botões, bordas) |
| `--clr-primary-ink` | vinho em texto sobre creme |
| `--clr-gold` | filetes e ornamentos decorativos |
| `--clr-gold-deep` | ouro quando precisa ser legível |
| `--clr-on-deep` | texto claro sobre as faixas vinho |

Duas faixas são escuras de propósito (`.social-section` e o rodapé). O texto
dentro delas usa `--clr-on-deep`; usar `--clr-text-dark` ali deixa o texto
invisível.

## Adicionar um produto ao catálogo

1. Converter a foto para `.webp` 600x800 e colocar em `images/`.
2. Duplicar a pasta de um produto existente, renomear para o novo slug
   (sempre em ASCII, sem acento) e ajustar título, descrição, imagem e o
   link do WhatsApp.
3. Acrescentar o card em `index.html`, dentro de `.products-slider-track`.
   São 6 cards por `.slider-page`; os pontos e as setas do carrossel são
   gerados pela quantidade de páginas, então não há nada a configurar.

## Ao mexer no CSS

Subir a query de versão (`styles.css?v=…`) em todos os HTML, senão o
navegador continua servindo a folha antiga do cache.

## Pendências

- Instagram ainda aponta para `@floriculturarecife`
- Sem domínio definitivo: `canonical` e `og:url` foram removidos e o
  `og:image` está relativo, o que limita o preview de link no WhatsApp
- Produtos sem link de catálogo do WhatsApp (`wa.me/p/…`)
