# Ana Claudia Gourmet — Site Institucional

Site de página única (one-page), responsivo, sem backend e pronto para o **GitHub Pages**.

## Arquivos

```
ana-claudia-gourmet/
├── index.html        ← estrutura do site
├── style.css         ← identidade visual e animações
├── script.js         ← interações (cobertura escorrendo, galeria, menu…)
├── LEIA-ME.md        ← este guia
└── images/           ← TODAS as imagens ficam aqui
    ├── logo.png
    ├── chef-ana-claudia.jpg
    ├── foto1.jpg … foto15.jpg
    └── _LEIA-ME-IMAGENS.txt
```

> As imagens atuais são **placeholders** (provisórias). Basta substituí-las
> pelos arquivos reais **mantendo o mesmo nome**. Não é preciso mexer no código.

## Como trocar as fotos

1. Entre na pasta `images/`.
2. Substitua o arquivo desejado mantendo o nome exato:
   - Foto da chef → `chef-ana-claudia.jpg`
   - Galeria → `foto1.jpg`, `foto2.jpg`, … `foto15.jpg`
   - Logotipo → `logo.png`
3. Pronto. O site usa o novo arquivo automaticamente.

## Como ter MAIS fotos na galeria (20, 30…)

1. Adicione os arquivos `foto16.jpg`, `foto17.jpg`, … na pasta `images/`.
2. Abra `script.js` e, no topo, altere apenas:
   ```js
   var TOTAL_FOTOS = 15;   // ← troque para 20, 30, etc.
   ```
3. Salve. Nada mais precisa ser alterado.

## Como configurar o Instagram

No topo do `script.js`:
```js
var INSTAGRAM_USER = "@instagram_da_empresa";   // ← seu @
var INSTAGRAM_URL  = "https://instagram.com/";   // ← link do perfil
```

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `ana-claudia-gourmet`).
2. Envie **todo o conteúdo desta pasta** (incluindo a pasta `images/`).
3. No repositório: **Settings → Pages**.
4. Em *Source*, escolha a branch `main` e a pasta `/ (root)` e salve.
5. Em poucos minutos o site fica no ar em:
   `https://SEU-USUARIO.github.io/ana-claudia-gourmet/`

> Dica: no `index.html`, atualize a linha
> `<link rel="canonical" href="...">` com o endereço final do site (ajuda no SEO).

## Personalização rápida de cores

As cores ficam no início do `style.css`, em `:root`. Elas já foram extraídas
do logotipo (navy, rosé/cobre, sálvia e marfim):
```css
--cacau: #0e2a57;   /* navy profundo (fundos escuros) */
--ouro:  #c2906c;   /* rosé/cobre (destaque)          */
--sage:  #97a791;   /* verde-sálvia                   */
--creme: #f6f2ea;   /* marfim (fundo claro/cobertura) */
```

## Contatos já configurados

- WhatsApp: (51) 99955-0311 → `https://wa.me/5551999550311`
- E-mail: aclaudiamsf@gmail.com
