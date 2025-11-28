#!/bin/bash

# Aumentar el límite de archivos abiertos para macOS
ulimit -n 10240

# Limpiar cache de Metro si existe
echo "Limpiando cache de Metro..."
rm -rf $TMPDIR/metro-* 2>/dev/null
rm -rf $TMPDIR/haste-* 2>/dev/null

# Iniciar Expo con limpieza de cache
echo "Iniciando Expo..."
npx expo start --clear
