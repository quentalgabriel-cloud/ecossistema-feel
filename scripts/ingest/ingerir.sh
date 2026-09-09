#!/usr/bin/env bash
# Ingestão de contexto — vídeo/URL → transcrição → memory/inbox
#
# D-07: yt-dlp é ferramenta local de ingestão. Não é dependência da aplicação,
# não vai para web/, não vai para o Vercel.
#
# O que interessa ao agente é o TEXTO. Por padrão baixamos só a legenda,
# nunca o vídeo.
#
# Uso:
#   ./ingerir.sh <URL>              # legenda de um vídeo remoto
#   ./ingerir.sh --local <arquivo>  # transcreve um vídeo local (precisa de whisper)
#   ./ingerir.sh --todos-locais     # tudo em contexto/video/
#
# Restrição (D-07): gravações próprias e material legitimamente acessível.
# Os termos das plataformas e o direito autoral se aplicam.

set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DEST_VTT="$RAIZ/contexto/transcricoes"
DEST_MD="$RAIZ/memory/inbox"

mkdir -p "$DEST_VTT" "$DEST_MD"

erro() { printf '\n  %s\n\n' "$1" >&2; exit 1; }

checar_ytdlp() {
  command -v yt-dlp >/dev/null 2>&1 || erro \
"yt-dlp nao encontrado.
   Instale com:  winget install yt-dlp
   (precisa tambem de ffmpeg:  winget install Gyan.FFmpeg)"
}

# ─── VTT → markdown com frontmatter ──────────────────────────────────────
# Remove timestamps, tags de cue e linhas duplicadas consecutivas
# (legenda automática repete a última linha em cada bloco).
vtt_para_md() {
  local vtt="$1" titulo="$2" origem="$3"
  local slug hoje saida
  slug=$(printf '%s' "$titulo" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -e 's/[^a-z0-9]\+/-/g' -e 's/^-//' -e 's/-$//' \
    | cut -c1-60)
  hoje=$(date +%Y-%m-%d)
  saida="$DEST_MD/${hoje}-${slug}.md"

  {
    printf -- '---\n'
    printf 'title: %s\n' "$titulo"
    printf 'tags: [transcricao, inbox]\n'
    printf 'created: %s\n' "$hoje"
    printf 'updated: %s\n' "$hoje"
    printf 'status: inbox\n'
    printf 'type: referencia\n'
    printf 'origem: %s\n' "$origem"
    printf -- '---\n\n'
    printf '# %s\n\n' "$titulo"
    printf '> Transcrição bruta. Ao consolidar, extraia UMA ideia por nota em\n'
    printf '> `memory/permanent/` com **Por quê** e **Como aplicar** — e apague esta.\n\n'
    sed -e '/-->/d' -e '/^WEBVTT/d' -e '/^Kind:/d' -e '/^Language:/d' \
        -e 's/<[^>]*>//g' -e '/^[[:space:]]*$/d' "$vtt" \
      | awk '$0 != prev { print } { prev = $0 }'
  } > "$saida"

  printf '  ✓ %s\n' "${saida#"$RAIZ"/}"
}

ingerir_url() {
  checar_ytdlp
  local url="$1"
  printf '\n  Baixando legenda (sem o vídeo)…\n'
  yt-dlp \
    --write-auto-subs --write-subs \
    --sub-lang 'pt.*,en.*' --sub-format vtt \
    --skip-download --no-playlist \
    --restrict-filenames \
    -o "$DEST_VTT/%(title)s.%(ext)s" \
    "$url"

  local titulo
  titulo=$(yt-dlp --no-playlist --print '%(title)s' "$url" 2>/dev/null || echo "sem-titulo")

  shopt -s nullglob
  local achou=0
  for vtt in "$DEST_VTT"/*.vtt; do
    [ -f "$vtt" ] || continue
    vtt_para_md "$vtt" "$titulo" "$url"
    achou=1
  done
  [ "$achou" = 1 ] || erro "Nenhuma legenda disponível para esse vídeo."
}

ingerir_local() {
  local arq="$1"
  [ -f "$arq" ] || erro "Arquivo não encontrado: $arq"
  command -v whisper >/dev/null 2>&1 || erro \
"whisper nao encontrado — necessario para video local sem legenda.
   Instale com:  pip install -U openai-whisper
   (precisa de Python e ffmpeg)"

  printf '\n  Transcrevendo %s…\n' "$(basename "$arq")"
  whisper "$arq" --language Portuguese --output_format vtt --output_dir "$DEST_VTT"

  local base vtt
  base=$(basename "${arq%.*}")
  vtt="$DEST_VTT/$base.vtt"
  [ -f "$vtt" ] || erro "whisper não gerou $vtt"
  vtt_para_md "$vtt" "$base" "local:$(basename "$arq")"
}

case "${1:-}" in
  --local)
    [ -n "${2:-}" ] || erro "Uso: ./ingerir.sh --local <arquivo>"
    ingerir_local "$2"
    ;;
  --todos-locais)
    shopt -s nullglob
    encontrou=0
    for f in "$RAIZ"/contexto/video/*.{mp4,webm,mov,m4a,mp3}; do
      [ -f "$f" ] || continue
      ingerir_local "$f"
      encontrou=1
    done
    [ "$encontrou" = 1 ] || erro "Nada em contexto/video/"
    ;;
  "" | -h | --help)
    awk 'NR==1 { next } /^#/ { sub(/^# ?/, ""); print; next } { exit }' "${BASH_SOURCE[0]}"
    ;;
  *)
    ingerir_url "$1"
    ;;
esac

printf '\n  Pronto. Revise em memory/inbox/ e consolide em memory/permanent/.\n\n'
