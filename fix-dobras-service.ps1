# Script para adicionar os casos faltantes no dobras-cutaneas-service.ts
$inputFile = "e:\apc-fit-pro\apcpro-api\src\services\dobras-cutaneas-service.ts"
$outputFile = "e:\apc-fit-pro\apcpro-api\src\services\dobras-cutaneas-service-fixed.ts"

$content = Get-Content $inputFile -Encoding UTF8
$newContent = @()

for ($i = 0; $i -lt $content.Length; $i++) {
    $line = $content[$i]
    $newContent += $line
    
    # Primeiro switch - após pollock-7 na validação
    if ($line -match "^\s*case 'pollock-7':" -and $i -lt $content.Length - 20) {
        # Pular até encontrar o break
        while ($i -lt $content.Length - 1 -and $content[$i] -notmatch "^\s*break;") {
            $i++
            $newContent += $content[$i]
        }
        
        # Verificar se ainda não adicionamos (evitar duplicatas)
        $nextFewLines = $content[($i+1)..($i+5)] -join " "
        if ($nextFewLines -notmatch "pollock7.*Alias") {
            # Adicionar casos faltantes
            $newContent += "        case 'pollock7': // Alias para pollock-7"
            $newContent += "        case 'pollock-9': {"
            $newContent += "          const medidasP9: MedidasPollock9 = {"
            $newContent += "            triceps: get('triceps'),"
            $newContent += "            subescapular: get('subescapular'),"
            $newContent += "            suprailiaca: get('suprailiaca'),"
            $newContent += "            abdominal: get('abdominal'),"
            $newContent += "            peitoral: get('peitoral'),"
            $newContent += "            axilarMedia: get('axilarmedia'),"
            $newContent += "            coxa: get('coxa'),"
            $newContent += "            biceps: get('biceps'),"
            $newContent += "            panturrilha: get('panturrilha')"
            $newContent += "          };"
            $newContent += "          if (!validarMedidasPollock9(medidasP9)) {"
            $newContent += "            erros.push('Medidas do protocolo Pollock 9 dobras inválidas');"
            $newContent += "            valida = false;"
            $newContent += "          }"
            $newContent += "          break;"
            $newContent += "        }"
            $newContent += "        case 'pollock9': // Alias para pollock-9"
            $newContent += "        case 'guedes': {"
            $newContent += "          const medidasGuedes: MedidasGuedes = {"
            $newContent += "            triceps: get('triceps'),"
            $newContent += "            subescapular: get('subescapular'),"
            $newContent += "            suprailiaca: get('suprailiaca'),"
            $newContent += "            abdominal: get('abdominal'),"
            $newContent += "            coxa: get('coxa'),"
            $newContent += "            peito: get('peitoral'),"
            $newContent += "            axilarMedia: get('axilarmedia')"
            $newContent += "          };"
            $newContent += "          if (!validarMedidasGuedes(medidasGuedes)) {"
            $newContent += "            erros.push('Medidas do protocolo Guedes inválidas');"
            $newContent += "            valida = false;"
            $newContent += "          }"
            $newContent += "          break;"
            $newContent += "        }"
        }
    }
    
    # Segundo switch - após pollock-7 no cálculo
    if ($line -match "^\s*case 'pollock-7':" -and $i -gt 200) { # segundo switch está mais pra baixo
        # Pular até encontrar o return
        while ($i -lt $content.Length - 1 -and $content[$i] -notmatch "return calcularPollock7") {
            $i++
            $newContent += $content[$i]
        }
        
        # Verificar se ainda não adicionamos
        $nextFewLines = $content[($i+1)..($i+5)] -join " "
        if ($nextFewLines -notmatch "pollock7.*Alias") {
            # Adicionar casos faltantes para cálculo
            $newContent += "      case 'pollock7': // Alias para pollock-7"
            $newContent += "      case 'pollock-9': {"
            $newContent += "        const medidasP9: MedidasPollock9 = {"
            $newContent += "          triceps: medidas.triceps,"
            $newContent += "          subescapular: medidas.subescapular,"
            $newContent += "          suprailiaca: medidas.suprailiaca,"
            $newContent += "          abdominal: medidas.abdominal,"
            $newContent += "          peitoral: medidas.peitoral,"
            $newContent += "          axilarMedia: medidas.axilarmedia,"
            $newContent += "          coxa: medidas.coxa,"
            $newContent += "          biceps: medidas.biceps,"
            $newContent += "          panturrilha: medidas.panturrilha"
            $newContent += "        };"
            $newContent += "        return calcularPollock9(medidasP9, generoProtocolo, idade!, peso);"
            $newContent += "      }"
            $newContent += "      case 'pollock9': // Alias para pollock-9"
            $newContent += "      case 'guedes': {"
            $newContent += "        const medidasGuedes: MedidasGuedes = {"
            $newContent += "          triceps: medidas.triceps,"
            $newContent += "          subescapular: medidas.subescapular,"
            $newContent += "          suprailiaca: medidas.suprailiaca,"
            $newContent += "          abdominal: medidas.abdominal,"
            $newContent += "          coxa: medidas.coxa,"
            $newContent += "          peito: medidas.peitoral,"
            $newContent += "          axilarMedia: medidas.axilarmedia"
            $newContent += "        };"
            $newContent += "        return calcularGuedes(medidasGuedes, generoProtocolo, idade!, peso);"
            $newContent += "      }"
        }
    }
}

Set-Content $outputFile -Value $newContent -Encoding UTF8
Write-Output "Arquivo corrigido salvo em: $outputFile"
