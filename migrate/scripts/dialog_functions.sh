#!/bin/bash

BKEND=172.16.100.201
BKENDTICKET=172.16.100.142

if [ "$1" = "sync" ]; then
  # request cache
  curl -s --user "access:qox3-la" http://$BKEND:8000/customer/ > ~/RAW_CUSTOMER.cache
  curl -s --user "access:qox3-la" http://$BKEND:8000/server/ > ~/RAW_SERVER.cache
  curl -s http://$BKENDTICKET:3000/auxiliaryTickets > ~/RAW_AUXILIARYTICKET.cache
fi

dialog_customer(){

if [ -z "$1" ]; then
  echo "Erro: Título de fundo não fornecido."
  exit 1
fi

# menu
BACKTITLE="$1"
TITLE=".---+++ Customers +++---."
MENU="Select Customer:"

f_request(){
  cat ~/RAW_CUSTOMER.cache | jq -r '.[] | "\(.name);\(.code)"' | sort -u -t ';'
} 

declare -a OPTIONS
while IFS= read -r line; do
  opt=$(echo "$line" | awk -F";" '{print $1}')
  msg=$(echo "$line" | awk -F";" '{print $2}')
  OPTIONS+=( "$opt" "$msg" )
done < <(f_request)

SEL_CUSTOMER=$(dialog --no-collapse --clear --backtitle "$BACKTITLE" --title "$TITLE" --menu "$MENU" 0 0 0 "${OPTIONS[@]}" 2>&1 >/dev/tty)

clear
if [[ -z $SEL_CUSTOMER ]] ; then
  exit
fi

}

dialog_server(){

if [ -z "$1" ]; then
  echo "Erro: Título de fundo não fornecido."
  exit 1
fi

ARG="$2" 

# menu
BACKTITLE="$1"
TITLE=".---+++ Servers +++---."
MENU="Select Server:"

f_request(){
CUSTOMER_ID=$(cat ~/RAW_CUSTOMER.cache | jq --arg SEL_CUSTOMER "$SEL_CUSTOMER" '.[] | select(.name == $SEL_CUSTOMER )' | jq -r  '.id')
cat ~/RAW_SERVER.cache | jq --arg v $CUSTOMER_ID '.[] | select(.customer == ($v | tonumber)) | "\(.id);\(.envr);\(.name);\(.addr);\(.port);\(.user);\(.desc)"'|  tr -d \"
}

declare -a OPTIONS
declare -r TAB="`echo -e "\t"`"
while IFS= read -r line; do
  opt=$(echo "$line" | awk -F";" '{print $3}')
  msg=$(echo "$line" | awk -F";" '{printf "%-40s %-12s %-10s \n", $4":"$5,$2,"[ "$7" ]"}')
  #case "${OPTIONS[@]}" in  *"$opt"*) continue ;; esac # dup remove
  OPTIONS+=( "$opt" "$msg" )
done < <(f_request)

SEL_SERVER=$(dialog --no-collapse --clear --backtitle "$BACKTITLE" --title "$TITLE" --menu "$MENU" 0 0 0 "${OPTIONS[@]}" 2>&1 >/dev/tty)

clear
if [[ -z $SEL_SERVER ]] ; then
  exit
fi

}

dialog_ticket(){

if [ -z "$1" ]; then
  echo "Erro: Título de fundo não fornecido."
  exit 1
fi

# menu
BACKTITLE="$1"
TITLE=".---+++ Customers +++---."
MENU="Select Customer:"

f_request(){
  cat ~/RAW_AUXILIARYTICKET.cache | jq -r '.[] | "\(.title);\(.duration)"'| sort -u -t ';'
} 

declare -a OPTIONS
while IFS= read -r line; do
  opt=$(echo "$line" | awk -F";" '{print $1}')
  msg=$(echo "$line" | awk -F";" '{print $2}')

if [ "$msg" -ge 60 ]; then
  msg=$(echo "scale=2; $msg / 60" | bc)
fi

  OPTIONS+=( "$opt" "$msg" )
done < <(f_request)

SEL_MODEL=$(dialog --no-collapse --clear --backtitle "$BACKTITLE" --title "$TITLE" --menu "$MENU" 0 0 0 "${OPTIONS[@]}" 2>&1 >/dev/tty)

clear
if [[ -z $SEL_MODEL ]] ; then
  exit
fi


MODEL_DETAILS=$(cat ~/RAW_AUXILIARYTICKET.cache | jq --arg SEL_MODEL "$SEL_MODEL" '.[] | select(.title == $SEL_MODEL )')

TITLE=$(echo "$MODEL_DETAILS" | jq -r '.title')
DESCRIPTION=$(echo "$MODEL_DETAILS" | jq -r '.description')
DURATION=$(echo "$MODEL_DETAILS" | jq -r '.duration')

dialog --backtitle "$BACKTITLE" \
  --title "Detalhes do Ticket" \
  --form "Por favor, revise os detalhes do ticket. Pressione OK para confirmar ou edite conforme necessário." \
  15 50 0 \
  "Título:" 1 1 "$TITLE" 1 20 30 0 \
  "Descrição:" 2 1 "$DESCRIPTION" 2 20 100 0 \
  "Duração:" 3 1 "$DURATION" 3 20 10 0 \
  2>&1 >/dev/tty

}