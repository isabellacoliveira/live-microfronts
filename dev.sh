#!/usr/bin/env bash
#
# dev.sh — facilita rodar os microfrontends (host + remotes + Angular).
#
# Modos:
#   ./dev.sh           # modo preview (produção): build + preview em background
#   ./dev.sh dev       # modo dev: sobe todos em dev server (sem build)
#   ./dev.sh build     # só build
#   ./dev.sh stop      # só mata as portas
#   ./dev.sh status    # mostra quem está rodando em cada porta
#   ./dev.sh logs      # acompanha os logs
#   ./dev.sh <app> dev # dev de um único app (ex.: ./dev.sh dashboard dev)
#
set -euo pipefail

PORTS=("5173" "5001" "5002" "5003")
LOG_DIR="/tmp/live-microfronts"
mkdir -p "$LOG_DIR"

# ---------------- helpers ----------------
kill_port() {
  local port="$1"
  local pids
  pids=$(lsof -ti tcp:"$port" 2>/dev/null || true)
  if [[ -n "$pids" ]]; then
    echo "  → liberando porta $port (PID: $pids)"
    kill $pids 2>/dev/null || true
    sleep 1
  fi
}

stop_all() {
  echo "🛑 Encerrando processos nas portas: ${PORTS[*]}"
  for port in "${PORTS[@]}"; do
    kill_port "$port"
  done
}

status() {
  echo "📊 Status das portas:"
  for port in "${PORTS[@]}"; do
    local pid
    pid=$(lsof -ti tcp:"$port" 2>/dev/null || true)
    if [[ -n "$pid" ]]; then
      echo "  porta $port → rodando (PID: $pid)"
    else
      echo "  porta $port → livre"
    fi
  done
}

build_all() {
  echo "🔨 Buildando remotes e host..."
  corepack pnpm --filter dashboard-mfe-react build
  corepack pnpm --filter profile-mfe-react build
  corepack pnpm --filter host-react build
  corepack pnpm --filter notifications-mfe-angular build
}

start_preview() {
  echo "🚀 Iniciando previews (produção) em background..."
  (corepack pnpm --filter dashboard-mfe-react preview > "$LOG_DIR/dashboard.log" 2>&1 &)
  (corepack pnpm --filter profile-mfe-react preview > "$LOG_DIR/profile.log" 2>&1 &)
  (corepack pnpm --filter notifications-mfe-angular preview > "$LOG_DIR/angular.log" 2>&1 &)
  (corepack pnpm --filter host-react preview > "$LOG_DIR/host.log" 2>&1 &)
  sleep 4
  echo ""
  status
  echo ""
}

start_dev() {
  echo "🚀 Iniciando dev servers em background..."
  (corepack pnpm --filter dashboard-mfe-react dev > "$LOG_DIR/dashboard.log" 2>&1 &)
  (corepack pnpm --filter profile-mfe-react dev > "$LOG_DIR/profile.log" 2>&1 &)
  (corepack pnpm --filter notifications-mfe-angular dev > "$LOG_DIR/angular.log" 2>&1 &)
  (corepack pnpm --filter host-react dev > "$LOG_DIR/host.log" 2>&1 &)
  sleep 4
  echo ""
  status
  echo ""
}

print_urls() {
  echo "✅ Host disponível em: http://127.0.0.1:5173/"
  echo "   Dashboard: http://127.0.0.1:5001/"
  echo "   Profile:   http://127.0.0.1:5002/"
  echo "   Angular (iframes): http://127.0.0.1:5003/"
  echo "   Logs:       tail -f $LOG_DIR/*.log"
}

# ---------------- main ----------------
case "${1:-all}" in
  stop)   stop_all ;;
  build)  build_all ;;
  logs)   tail -f "$LOG_DIR"/*.log ;;
  status) status ;;
  dev)
    stop_all
    start_dev
    print_urls
    ;;
  all|*)
    stop_all
    build_all
    start_preview
    print_urls
    ;;
esac
