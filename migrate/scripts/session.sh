#!/bin/bash

start_time=$(date +%s)

ssh seu_usuario@seu_servidor

end_time=$(date +%s)
duration=$((end_time - start_time))

echo "A sessão SSH durou $duration segundos."

#!/bin/bash

# Definir o nome do arquivo de log
log_file="session_log_$(date +%Y-%m-%d_%H-%M-%S).log"

# Registrar o horário de início da sessão
start_time=$(date +%s)

# Iniciar a sessão SSH e redirecionar o output para o arquivo de log
ssh seu_usuario@seu_servidor > "$log_file" 2>&1

# Registrar o horário de término da sessão
end_time=$(date +%s)

# Calcular a duração da sessão em segundos
duration=$((end_time - start_time))

# Escrever a duração da sessão no arquivo de log
echo "A sessão SSH durou $duration segundos." >> "$log_file"

# Mostrar mensagem na tela
echo "A sessão SSH durou $duration segundos. O log foi salvo em $log_file."
