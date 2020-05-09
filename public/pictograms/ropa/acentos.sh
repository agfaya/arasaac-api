#!/bin/bash

for f in *; do
  nuevo=$(echo "$f" |   sed  'y/áÁàÀãÃâÂéÉêÊíÍóÓõÕôÔúÚçÇªº/aAaAaAaAeEeEiIoOoOoOuUcCao/')
  test  "$f" != "$nuevo" &&  (echo "Corrigiendo $f" ; mv "$f" "$nuevo")
done