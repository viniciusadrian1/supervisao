# 📦 Assets — o que substituir pelos arquivos reais do cliente

Esta pasta guarda as imagens/vídeos da landing page. Hoje ela contém
**placeholders** (SVGs gerados, gradientes e ilustrações inline) para a página
já ficar bonita e funcional **sem depender de nenhum upload**. Troque pelos
arquivos reais quando o cliente enviar.

> Procure por `⚠️ ASSET` no `index.html` para achar cada ponto exato no código.

| Arquivo / placeholder | O que é hoje | Substituir por | Onde aparece |
|---|---|---|---|
| `favicon.svg` | Ícone gerado (mantém) | Pode manter ou trocar pelo ícone oficial | `<head>` |
| `og-image.jpg` | **Capa raster 1200×630 já gerada** (placeholder funcional — previews de WhatsApp/Meta funcionam) | Arte final do cliente, se desejar | `<head>` (og:image / twitter:image) |
| `og-image.svg` | Fonte vetorial da capa (para reexportar) | — | (apoio) |
| **Vídeo do hero** | Ilustração SVG "device-frame" animada | `hero-loop.mp4` + `hero-loop.webm` + `hero-poster.webp` **ou** embed real de tour 360º | Seção 1 (Hero) |
| **Badge Google** | Selo desenhado em SVG (texto + "G") | `trusted_photographer_google_maps_street_view.png` (peça ao cliente / site institucional) | Hero, CTA final, rodapé |
| **Logos de clientes** | Nomes estilizados em texto | Logos `.webp` (⚠️ confirmar permissão de uso) | Seção 2 (faixa de logos) |
| **Thumbnails dos tours** | ✅ **Já inseridas** — 6 fotos reais otimizadas em `assets/images/*.webp` (originais `.png` mantidas na mesma pasta) | Trocar só se quiser fotos melhores | Seção 6 (galeria) |

## Boas práticas ao inserir imagens reais
- Converta para **`.webp`** (peso menor, mesma qualidade).
- Adicione **`loading="lazy"`** em toda imagem fora da primeira dobra.
- Sempre preencha o **`alt`** descritivo (acessibilidade + SEO).
- Vídeo do hero: comprima bem, use `poster`, `muted`, `loop`, `playsinline`,
  e mantenha abaixo de ~2–3 MB para não prejudicar o LCP.

## Como exportar o `og-image.svg` para `.jpg`
As redes sociais (Meta/WhatsApp) preferem JPG/PNG no Open Graph. Opções:
- Abra `og-image.svg` no navegador, tire um print 1200×630 e salve como `og-image.jpg`; ou
- Use um conversor (ex.: `cloudconvert.com`, Figma, Inkscape) para SVG → JPG 1200×630.
