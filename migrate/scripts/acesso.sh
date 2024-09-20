#!/bin/bash

source "dialog_functions.sh"

dialog_customer "DB Access"

dialog_server "DB Access" "$CUSTOMER_ID"

SERVER_ID=$(cat ~/RAW_SERVER.cache | jq --arg SEL_SERVER "$SEL_SERVER" '.[] | select(.name == $SEL_SERVER )' | jq -r  '.id')
CONNECT_DATA=$(cat ~/RAW_SERVER.cache | jq --arg v $SERVER_ID '.[] | select(.id == ($v | tonumber)) | "\(.id);\(.envr);\(.name);\(.addr);\(.port);\(.user);\(.desc)"'|  tr -d \")
SERVER_ENV=$(echo $CONNECT_DATA|awk -F";" {'print $2'})
SERVER_DSC=$(echo $CONNECT_DATA|awk -F";" {'print $7'})
BANNER_SSH=$(echo $CONNECT_DATA|awk -F";" {'print "ssh "$6"@"$4" -p "$5'})
CONNECT_SSH=$(echo $CONNECT_DATA|awk -F";" {'print "ssh -o StrictHostKeyChecking=no "$6"@"$4" -p "$5'})


CONNECT_DATE=$(echo "`date "+%Y-%m-%d %H:%M:%S"`") 

COFF='\033[0m'
IGRE='\033[1;92m'
IGRN='\033[0;92m'
IBLU='\033[0;94m'
IPUR='\033[0;35m'
ICYA='\033[0;96m'
IRED='\033[0;91m'
IYEL='\033[4;33m'

## Connect Banner
echo ""
echo ""
BANNER=$(printf "
${ICYA}ConnDate${COFF} .........${IPUR}:${COFF} ${IGRN}${CONNECT_DATE}${COFF}
${ICYA}Customer${COFF} .........${IPUR}:${COFF} ${IGRN}${SEL_CUSTOMER}${COFF}
${ICYA}Server${COFF} ...........${IPUR}:${COFF} ${IGRN}${SEL_SERVER}${COFF}
${ICYA}Enviroment${COFF} .......${IPUR}:${COFF} ${IYEL}${SERVER_ENV}${COFF} ${IGRN}[${COFF} ${IRED}${SERVER_DSC}${COFF} ${IGRN}]${COFF} ")
echo "$BANNER"
echo ""
echo ""
echo "$BANNER_SSH"
echo ""

# prompt_toolkit

## Connection:

#echo "`date "+%Y-%m-%d %H:%M:%S"` *** `whoami` ***  $BANNER - **  $CONNECT_SSH **"
#echo "`date "+%Y-%m-%d %H:%M:%S"` *** `whoami` ***  $BANNER - **  $BANNER_SSH **" >> /var/log/auditacesso.log
#echo "`date "+%Y-%m-%d %H:%M:%S"` *** `whoami` ***  $BANNER - **  $BANNER_SSH **" 

START_TIME=$(date +%s)

eval $CONNECT_SSH

END_TIME=$(date +%s)

DURATION=$((END_TIME - START_TIME))

echo ""
echo "A sessão SSH durou $DURATION segundos."

echo "`date "+%Y-%m-%d %H:%M:%S"` *** `whoami` ***  $BANNER - **  $CONNECT_SSH **" >> /var/log/auditacesso.log