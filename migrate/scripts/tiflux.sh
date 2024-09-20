#!/bin/bash

# Função para fazer a requisição HTTP com autenticação básica
make_authenticated_request() {
    local basic_token="$1"
    local url="$2"
    
    # Faz a requisição GET com o token de autenticação básica no cabeçalho Authorization
    response=$(curl --silent -H "Authorization: Basic $basic_token" "$url")

    # Verifica se a requisição foi bem-sucedida
    if [ $? -eq 0 ]; then
        # Se a requisição foi bem-sucedida, retorna a resposta
        echo "$response"
        return 0
    else
        # Se a requisição falhou, retorna um código de erro
        return 1
    fi
}

dialog_credentials() {
    # Título e mensagem para o prompt de entrada do usuário e senha
    TITLE="Login"
    MESSAGE="Please enter your credentials:"

    # Caixas de diálogo para entrada do usuário e senha
    USER=$(dialog --clear --backtitle "$BACKTITLE" --title "$TITLE" \
                  --inputbox "$MESSAGE" 8 60 2>&1 >/dev/tty)
    PASSWORD=$(dialog --clear --backtitle "$BACKTITLE" --title "$TITLE" \
                      --insecure --passwordbox "$MESSAGE" 8 60 2>&1 >/dev/tty)

    # Verificar se o usuário cancelou a operação
    if [[ -z "$USER" || -z "$PASSWORD" ]]; then
        clear
        echo "Operação cancelada."
        exit 1
    fi

    # Retornar o nome de usuário e senha
    echo "$USER;$PASSWORD"
}

save_credentials_to_cache() {
    local credentials="$1"
    echo "$credentials" >> ~/.credentials.cache
}

perform_initial_request() {
    local basic_token="$1"
    local url="$2"
    
    # Faz a requisição inicial com as credenciais fornecidas
    response=$(make_authenticated_request "$basic_token" "$url")

    # Verifica se a requisição foi bem-sucedida
    if [ $? -eq 0 ]; then
        # Se a requisição foi bem-sucedida, salva as credenciais em um arquivo .cache
        save_credentials_to_cache "$basic_token"
        # Exporta a variável de ambiente para a sessão atual
        export BASIC_API_TIFLUX="$basic_token"
    else
        # Se a requisição falhou, solicita as credenciais novamente
        echo "Error making request. Please enter credentials again."
        BASIC_API_TIFLUX=$(dialog_credentials)
        
        # Tenta fazer a requisição novamente com as novas credenciais
        response=$(make_authenticated_request "$BASIC_API_TIFLUX" "$url")

        # Verifica se a requisição com as novas credenciais foi bem-sucedida
        if [ $? -eq 0 ]; then
            # Se a requisição foi bem-sucedida, salva as novas credenciais em um arquivo .cache
            save_credentials_to_cache "$BASIC_API_TIFLUX"
            # Exporta a variável de ambiente para a sessão atual
            export BASIC_API_TIFLUX="$BASIC_API_TIFLUX"
        else
            # Se a requisição com as novas credenciais falhou, exibe uma mensagem de erro
            echo "Error making request with new credentials."
            exit 1
        fi
    fi
}


