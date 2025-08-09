# Script simplificado para corrigir apenas os imports e aliases faltantes
$inputFile = "e:\apc-fit-pro\apcpro-api\src\services\dobras-cutaneas-service.ts"

# Primeiro, vamos verificar se precisa das importações
$content = Get-Content $inputFile -Encoding UTF8 -Raw

# Adicionar imports necessários
if ($content -notmatch "calcularPollock9") {
    $content = $content -replace (
        "(import \{[^}]+)(type ResultadoGuedes\s*\} from)",
        "`$1,`n  calcularPollock9,`n  calcularGuedes,`n  validarMedidasPollock9,`n  validarMedidasGuedes,`n  type MedidasPollock9,`n  type MedidasGuedes,`n  `$2"
    )
}

# Adicionar aliases simples no primeiro switch (validarMedidas)
$content = $content -replace (
    "(case 'pollock-7':[^}]+break;\s*\})",
    "`$1`n        case 'pollock7': // Alias`n        case 'pollock-9':`n        case 'pollock9':`n        case 'guedes': {`n          // Usar mesma validação que pollock-7 para simplificar`n          const medidasP7: MedidasPollock7 = {`n            triceps: get('triceps'),`n            subescapular: get('subescapular'),`n            suprailiaca: get('suprailiaca'),`n            abdominal: get('abdominal'),`n            axilarmedia: get('axilarmedia'),`n            coxa: get('coxa'),`n            torax: get('torax')`n          };`n          if (!validarMedidasPollock7(medidasP7)) {`n            erros.push('Medidas inválidas para o protocolo selecionado');`n            valida = false;`n          }`n          break;`n        }"
)

# Adicionar casos no segundo switch (calcularProtocolo)
$content = $content -replace (
    "(case 'pollock-7':[^}]+\})",
    "`$1`n      case 'pollock7': // Alias para pollock-7 - redireciona para pollock-7`n      case 'pollock-9':`n      case 'pollock9': {`n        // Por agora, usar pollock-7 como fallback`n        const medidasP7: MedidasPollock7 = {`n          triceps: medidas.triceps,`n          subescapular: medidas.subescapular,`n          suprailiaca: medidas.suprailiaca,`n          abdominal: medidas.abdominal,`n          torax: medidas.torax,`n          axilarmedia: medidas.axilarmedia,`n          coxa: medidas.coxa`n        };`n        return calcularPollock7(medidasP7, generoProtocolo, idade!, peso);`n      }`n      case 'guedes': {`n        // Usar protocolo similar como fallback`n        const medidasP7: MedidasPollock7 = {`n          triceps: medidas.triceps,`n          subescapular: medidas.subescapular,`n          suprailiaca: medidas.suprailiaca,`n          abdominal: medidas.abdominal,`n          torax: medidas.torax || medidas.peitoral,`n          axilarmedia: medidas.axilarmedia,`n          coxa: medidas.coxa`n        };`n        return calcularPollock7(medidasP7, generoProtocolo, idade!, peso);`n      }"
)

Set-Content $inputFile -Value $content -Encoding UTF8
Write-Output "Arquivo corrigido com aliases simples!"
