#!/bin/bash

# Inclui o script tiflux.sh que contém as funções necessárias
source tiflux.sh 

# IP do backend
BKEND=172.16.100.201

# Loop através dos argumentos passados para o script
for arg in "$@"; do
    if [ "$arg" == "sync" ]; then
        # Requisição para atualizar o cache
        echo "Atualizando o cache de clientes e servidores..."
        curl -s --user "access:qox3-la" "http://$BKEND:8000/customer/" > ~/RAW_CUSTOMER.cache
        curl -s --user "access:qox3-la" "http://$BKEND:8000/server/" > ~/RAW_SERVER.cache
        echo "Cache atualizado com sucesso."
    elif [ "$arg" == "-t" ]; then
        # Verifica se as credenciais estão presentes no cache
        if [[ -f ~/.credentials.cache ]]; then
            # Carrega as credenciais do cache
            BASIC_API_TIFLUX=$(<~/.credentials.cache)
            export BASIC_API_TIFLUX

            # Define a URL base e o endpoint de perfil
            URL_BASE_API="http://172.16.100.142:3000/"
            PROFILE_ENDPOINT="${URL_BASE_API}users/profile"

            # Faça a requisição inicial e atualize as credenciais se necessário
            echo "Realizando a requisição inicial..."
            perform_initial_request "$BASIC_API_TIFLUX" "$PROFILE_ENDPOINT"
            echo "Requisição inicial completa."
        else
            # Se as credenciais não estiverem presentes no cache, solicita as credenciais
            echo "Credenciais não encontradas. Por favor, forneça suas credenciais."
            BASIC_API_TIFLUX=$(dialog_credentials)

            # Define a URL base e o endpoint de perfil
            URL_BASE_API="http://172.16.100.142:3000/"
            PROFILE_ENDPOINT="${URL_BASE_API}users/profile"

            # Faça a requisição inicial com as novas credenciais
            echo "Realizando a requisição inicial com as novas credenciais..."
            perform_initial_request "$BASIC_API_TIFLUX" "$PROFILE_ENDPOINT"
            echo "Requisição inicial completa."
        fi
    fi
done 
